'use client';
import { pickQuestions } from '../data/questions';

export const WIN_SCORE = 3;
export const POOL_SIZE = 10;
export const HAND_SIZE = 5;

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getVal(card, field) {
  if (card.stats && field in card.stats) return card.stats[field];
  return card[field];
}

export function compareCards(cardA, cardB, question) {
  const a = getVal(cardA, question.field);
  const b = getVal(cardB, question.field);
  if (question.higher_wins) {
    if (a > b) return 'A';
    if (b > a) return 'B';
  } else {
    if (a < b) return 'A';
    if (b < a) return 'B';
  }
  return 'draw';
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
  const groups = { GK: [], DEF: [], MID: [], FWD: [] };
  allPlayers.forEach(p => groups[posGroup(p)].push(p));
  Object.keys(groups).forEach(k => { groups[k] = shuffle(groups[k]); });

  const poolA = [], poolB = [];
  const mins = { GK: 2, DEF: 2, MID: 2, FWD: 2 };
  const leftover = [];
  Object.entries(groups).forEach(([k, arr]) => {
    const n = Math.min(mins[k], Math.floor(arr.length / 2));
    poolA.push(...arr.splice(0, n));
    poolB.push(...arr.splice(0, n));
    leftover.push(...arr);
  });
  const rest = shuffle(leftover);
  while (poolA.length < poolSize && rest.length) poolA.push(rest.pop());
  while (poolB.length < poolSize && rest.length) poolB.push(rest.pop());
  return [shuffle(poolA), shuffle(poolB)];
}

export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function buildInitialState(playerAName, allPlayers) {
  const [poolA, poolB] = buildBalancedPools(allPlayers, POOL_SIZE);
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
    questions: pickQuestions(10),
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
