'use client';
import { QUESTIONS } from '../data/questions';

export const WIN_SCORE = 3;
export const POOL_SIZE = 10;
export const HAND_SIZE = 5;

// ── Hesaplanmış alanlar ──────────────────────────────────────────────────────
// (card, stats) → sayısal değer | null
const COMPUTED = {
  career_goals_assists:    (p, s) => (s.career_goals_total  || 0) + (s.career_assists_total  || 0),
  intl_goals_assists:      (p, s) => (s.international_goals  || 0) + (s.international_assists || 0),
  goals_per_game:          (p, s) => s.career_appearances > 0 ? +(s.career_goals_total  / s.career_appearances).toFixed(3) : null,
  assists_per_game:        (p, s) => s.career_appearances > 0 ? +(s.career_assists_total / s.career_appearances).toFixed(3) : null,
  intl_goals_per_cap:      (p, s) => s.international_caps  > 0 ? +(s.international_goals  / s.international_caps).toFixed(3)  : null,
  goals_per_season:        (p, s) => s.years_pro            > 0 ? +(s.career_goals_total  / s.years_pro).toFixed(2)           : null,
  cards_per_game:          (p, s) => s.career_appearances > 0 ? +(s.career_cards_total   / s.career_appearances).toFixed(3) : null,
  european_goals:          (p, s) => (s.ucl_goals || 0) + (s.europa_league_goals || 0),
  career_earnings_m:       (p, s) => (s.years_pro && s.weekly_wage_k) ? Math.round(s.years_pro * s.weekly_wage_k * 52 / 1000) : null,
  social_media_total:      (p, s) => (s.instagram_m || 0) + (s.twitter_m || 0) + (s.tiktok_m || 0),
  full_name_length:        (p)    => (p.full_name || p.name || '').length,
  // trophies_total = kulüp kupaları + milli kupalar (varsa)
  trophies_total:          (p, s) => (s.trophies_total > 0) ? s.trophies_total : ((s.club_titles_total || 0) + (s.national_trophies || 0)) || null,
  // Yeni hesaplanmış alanlar
  titles_per_season:       (p, s) => (s.years_pro > 0 && s.club_titles_total > 0) ? +(s.club_titles_total / s.years_pro).toFixed(3) : null,
  goals_per_club:          (p, s) => (s.clubs_count > 0 && s.career_goals_total > 0) ? +(s.career_goals_total / s.clubs_count).toFixed(2) : null,
  caps_per_year:           (p, s) => (s.years_pro > 0 && s.international_caps > 0) ? +(s.international_caps / s.years_pro).toFixed(2) : null,
  ucl_goal_ratio:          (p, s) => (s.career_goals_total > 0 && s.ucl_goals > 0) ? +(s.ucl_goals / s.career_goals_total * 100).toFixed(1) : null,
  involvement_per_game:    (p, s) => s.career_appearances > 0 ? +(((s.career_goals_total || 0) + (s.career_assists_total || 0)) / s.career_appearances).toFixed(3) : null,
  intl_goal_ratio:         (p, s) => (s.career_goals_total > 0 && s.international_goals > 0) ? +(s.international_goals / s.career_goals_total * 100).toFixed(1) : null,
  bmi:                     (p, s) => (s.height_cm > 0 && s.weight_kg > 0) ? +(s.weight_kg / Math.pow(s.height_cm / 100, 2)).toFixed(1) : null,
  clubs_per_year:          (p, s) => (s.years_pro > 0 && s.clubs_count > 1) ? +(s.clubs_count / s.years_pro).toFixed(3) : null,
  value_per_game:          (p, s) => (s.career_appearances > 0 && s.peak_market_value_m > 0) ? +(s.peak_market_value_m * 1000 / s.career_appearances).toFixed(1) : null,
  intl_ratio:              (p, s) => (s.career_appearances > 0 && s.international_caps > 0) ? +(s.international_caps / s.career_appearances * 100).toFixed(1) : null,
  intl_goals_per_year:     (p, s) => (s.years_pro > 0 && s.international_goals > 0) ? +(s.international_goals / s.years_pro).toFixed(2) : null,
  wc_goals_per_game:       (p, s) => (s.world_cup_appearances > 0 && s.world_cup_goals > 0) ? +(s.world_cup_goals / s.world_cup_appearances).toFixed(3) : null,
};

export function getVal(card, field) {
  const fn = COMPUTED[field];
  if (fn) {
    const val = fn(card, card.stats || {});
    return val ?? null;
  }
  const s = card.stats || {};
  if (field in s) return s[field] ?? null;
  return card[field] ?? null;
}

export function compareCards(cardA, cardB, question) {
  const a = getVal(cardA, question.field);
  const b = getVal(cardB, question.field);
  if (a === null && b === null) return 'draw';
  if (a === null) return 'B';
  if (b === null) return 'A';
  if (question.higher_wins) {
    if (a > b) return 'A';
    if (b > a) return 'B';
  } else {
    if (a < b) return 'A';
    if (b < a) return 'B';
  }
  return 'draw';
}

// ── Akıllı soru seçimi ───────────────────────────────────────────────────────
// Havuzdaki oyuncuların en az %30'unun verisi olan soruları filtreler.
// Aynı field+higher_wins çiftini aynı oyunda iki kez seçmez.
export function pickQuestions(count = 10, poolPlayers = []) {
  let candidates = QUESTIONS.filter(q => !q.disabled);

  if (poolPlayers.length > 0) {
    candidates = QUESTIONS.filter(q => {
      const withData = poolPlayers.filter(p => {
        const v = getVal(p, q.field);
        if (q.zero_valid) return v !== null && v !== undefined;
        return v !== null && v !== undefined && v > 0;
      });
      return withData.length >= poolPlayers.length * 0.3;
    });
  }

  // Aynı field+yön ikili birden seçilmesin
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const picked = [];
  const usedKeys = new Set();
  for (const q of shuffled) {
    if (picked.length >= count) break;
    const key = `${q.field}|${q.higher_wins}`;
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    picked.push(q);
  }
  return picked;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEF_POS = new Set(['CB', 'LB', 'RB', 'LWB', 'RWB']);
const MID_POS = new Set(['CM', 'CDM', 'CAM', 'AM']);

function posGroup(p) {
  const pos = (p.position || '').toUpperCase();
  if (pos === 'GK') return 'GK';
  if (DEF_POS.has(pos)) return 'DEF';
  if (MID_POS.has(pos)) return 'MID';
  return 'FWD';
}

export function buildBalancedPools(allPlayers, poolSize) {
  // Separate legends (retired) from active players
  const legends = shuffle(allPlayers.filter(p => p.current_club === 'Emekli'));
  const active  = allPlayers.filter(p => p.current_club !== 'Emekli');

  // 2 legends per pool
  const legendsA = legends.splice(0, 2);
  const legendsB = legends.splice(0, 2);

  // Active players grouped by position
  const groups = { GK: [], DEF: [], MID: [], FWD: [] };
  active.forEach(p => groups[posGroup(p)].push(p));
  Object.keys(groups).forEach(k => { groups[k] = shuffle(groups[k]); });

  // 2 per position per pool (8 slots) + 2 legends = 10 total
  const poolA = [...legendsA];
  const poolB = [...legendsB];
  const leftover = [];
  const mins = { GK: 2, DEF: 2, MID: 2, FWD: 2 };
  Object.entries(groups).forEach(([k, arr]) => {
    const n = Math.min(mins[k], Math.floor(arr.length / 2));
    poolA.push(...arr.splice(0, n));
    poolB.push(...arr.splice(0, n));
    leftover.push(...arr);
  });

  // Fill any remaining slots from leftover active players
  const rest = shuffle([...leftover, ...legends]);
  while (poolA.length < poolSize && rest.length) poolA.push(rest.pop());
  while (poolB.length < poolSize && rest.length) poolB.push(rest.pop());
  return [shuffle(poolA), shuffle(poolB)];
}

export function generateRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function buildInitialState(playerAName, allPlayers) {
  const [poolA, poolB] = buildBalancedPools(allPlayers, POOL_SIZE);
  const poolPlayers = [...poolA, ...poolB];
  return {
    phase: 'waiting-for-b',
    player_a: playerAName,
    player_b: null,
    pool_a: poolA,
    pool_b: poolB,
    hand_a: [],
    hand_b: [],
    draft_sel_a: [],
    draft_sel_b: [],
    draft_confirmed_a: false,
    draft_confirmed_b: false,
    questions: pickQuestions(10, poolPlayers),
    question_index: 0,
    score_a: 0,
    score_b: 0,
    chosen_a: null,
    chosen_b: null,
    used_a: [],
    used_b: [],
    round_result: null,
    round_history: [],
    ready_next_a: false,
    ready_next_b: false,
  };
}
