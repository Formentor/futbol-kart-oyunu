'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  WIN_SCORE, HAND_SIZE,
  getVal, compareCards, generateRoomCode, buildInitialState,
} from '../lib/gameUtils';

export function useOnlineGame(allPlayers) {
  const [roomCode, setRoomCode] = useState(null);
  const [role, setRole] = useState(null); // 'A' or 'B'
  const [gs, setGs] = useState(null);     // game state from Supabase
  const [lobbyError, setLobbyError] = useState('');
  const resolvedRef = useRef(false);      // prevent double-resolve
  const pendingChoiceRef = useRef(null);  // { key, id } — preserve card selection against stale realtime events
  const pendingDraftRef = useRef(null);   // { key, value } — preserve draft selection against stale realtime events

  // ── Supabase helpers ────────────────────────────────────────────────────────
  const gsRef = useRef(null);
  useEffect(() => { gsRef.current = gs; }, [gs]);

  const updateState = useCallback(async (patch, code, baseState) => {
    const rc = code || roomCode;
    const base = baseState ?? gsRef.current;
    if (!base && !baseState) {
      // fallback: fetch from supabase if we have no local state
      const { data } = await supabase.from('games').select('state').eq('room_code', rc).single();
      if (!data) return;
      const merged = { ...data.state, ...patch };
      await supabase.from('games').update({ state: merged, updated_at: new Date().toISOString() }).eq('room_code', rc);
      return;
    }
    const merged = { ...base, ...patch };
    await supabase.from('games')
      .update({ state: merged, updated_at: new Date().toISOString() })
      .eq('room_code', rc);
  }, [roomCode]);

  // ── Realtime subscription ────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomCode) return;
    const channel = supabase
      .channel(`game-${roomCode}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `room_code=eq.${roomCode}` },
        payload => {
          const incoming = payload.new.state;
          // Restore pending card choice if wiped by stale event
          if (pendingChoiceRef.current) {
            const { key, id } = pendingChoiceRef.current;
            if (!incoming[key]) incoming[key] = id;
          }
          // Restore pending draft selection if wiped by stale event
          if (pendingDraftRef.current) {
            const { key, value } = pendingDraftRef.current;
            incoming[key] = value;
          }
          setGs(incoming);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomCode]);

  // ── Role A: auto-resolve when both cards chosen ──────────────────────────────
  // Accepts the state object directly so it can be called from the stuck detector too.
  const doResolve = useCallback((g) => {
    if (!g || role !== 'A') return;
    if (!g.chosen_a || !g.chosen_b || g.round_result) return;
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    const cardA = g.hand_a.find(p => p.id === g.chosen_a);
    const cardB = g.hand_b.find(p => p.id === g.chosen_b);
    if (!cardA || !cardB) {
      resolvedRef.current = false; // allow retry if cards not found yet
      return;
    }

    const question = g.questions[g.question_index];
    const winner = compareCards(cardA, cardB, question);
    const newScoreA = winner === 'A' ? g.score_a + 1 : g.score_a;
    const newScoreB = winner === 'B' ? g.score_b + 1 : g.score_b;
    const result = {
      winner, cardA, cardB, question,
      valA: getVal(cardA, question.field),
      valB: getVal(cardB, question.field),
    };
    const isFinal = newScoreA >= WIN_SCORE || newScoreB >= WIN_SCORE;
    supabase.rpc('patch_game_state', { p_room_code: roomCode, p_patch: {
      round_result: result,
      round_history: [...g.round_history, result],
      used_a: [...g.used_a, g.chosen_a],
      used_b: [...g.used_b, g.chosen_b],
      score_a: newScoreA,
      score_b: newScoreB,
      phase: isFinal ? 'reveal-final' : 'reveal',
      ready_next_a: false,
      ready_next_b: false,
    } }).then(({ error }) => {
      if (error) {
        console.error('Resolution RPC failed, will retry:', error);
        resolvedRef.current = false;
      }
    });
  }, [role, roomCode]);

  useEffect(() => {
    doResolve(gs);
  }, [gs?.chosen_a, gs?.chosen_b, gs?.round_result, doResolve]);

  // ── Reset guards on new round ────────────────────────────────────────────────
  useEffect(() => {
    if (gs?.phase === 'play') {
      resolvedRef.current = false;
      pendingChoiceRef.current = null;
      lastChoiceRef.current = null; // clear so re-submit doesn't replay previous round's card
    }
  }, [gs?.phase]);

  // ── Stuck detector: poll Supabase every 2s when waiting for opponent's card ──
  useEffect(() => {
    if (!roomCode || !gs) return;
    const myChosen = role === 'A' ? gs.chosen_a : gs.chosen_b;
    if (gs.phase !== 'play' || !myChosen || gs.round_result) return;
    const poll = setInterval(async () => {
      const { data } = await supabase.from('games').select('state').eq('room_code', roomCode).single();
      if (!data) return;
      // For role A: if both cards chosen but still in play, force-retry resolution
      // in case the realtime event was missed or the previous RPC failed.
      if (role === 'A' && data.state.chosen_a && data.state.chosen_b && !data.state.round_result) {
        resolvedRef.current = false;
        doResolve(data.state);
      }
      setGs(data.state);
    }, 2000);
    return () => clearInterval(poll);
  }, [gs?.phase, gs?.chosen_a, gs?.chosen_b, gs?.round_result, roomCode, role, doResolve]);

  // ── Lobby actions ────────────────────────────────────────────────────────────
  const createGame = useCallback(async (nameA) => {
    if (!allPlayers.length) return;
    setLobbyError('');
    const code = generateRoomCode();
    const state = buildInitialState(nameA, allPlayers);
    const { error } = await supabase.from('games').insert({ room_code: code, state });
    if (error) { setLobbyError('Oyun oluşturulamadı: ' + error.message); return; }
    setRoomCode(code);
    setRole('A');
    setGs(state);
  }, [allPlayers]);

  const joinGame = useCallback(async (code, nameB) => {
    setLobbyError('');
    try {
      const rc = String(code).trim();
      const { data, error } = await supabase.from('games').select('state').eq('room_code', rc).single();
      if (error || !data) { setLobbyError('Oda bulunamadı: ' + (error?.message || 'Kod yanlış olabilir')); return; }
      if (data.state.player_b) { setLobbyError('Bu oda dolu.'); return; }
      if (data.state.phase !== 'waiting-for-b') { setLobbyError('Oyun zaten başlamış.'); return; }
      const newState = { ...data.state, player_b: nameB, phase: 'draft' };
      const { error: writeErr } = await supabase.from('games')
        .update({ state: newState, updated_at: new Date().toISOString() })
        .eq('room_code', rc);
      if (writeErr) { setLobbyError('Odaya katılınamadı: ' + writeErr.message); return; }
      setRoomCode(rc);
      setRole('B');
      setGs(newState);
    } catch (e) {
      setLobbyError('Beklenmedik hata: ' + e.message);
    }
  }, []);

  // ── Draft actions ────────────────────────────────────────────────────────────
  // Ref holds the latest selection so rapid clicks don't read stale gs closure.
  const draftSelRef = useRef([]);
  useEffect(() => {
    if (gs && role) {
      draftSelRef.current = role === 'A' ? gs.draft_sel_a : gs.draft_sel_b;
    }
  }, [gs, role]);

  const toggleDraft = useCallback((id) => {
    if (!role) return;
    const key = role === 'A' ? 'draft_sel_a' : 'draft_sel_b';
    const current = draftSelRef.current;
    const next = current.includes(id)
      ? current.filter(x => x !== id)
      : current.length < HAND_SIZE ? [...current, id] : current;
    draftSelRef.current = next; // update immediately so next rapid click sees it
    pendingDraftRef.current = { key, value: next };
    setGs(prev => ({ ...prev, [key]: next }));
    updateState({ [key]: next }).then(() => {
      pendingDraftRef.current = null;
    });
  }, [role, updateState]);

  const confirmDraft = useCallback(async () => {
    if (!gs || !role) return;
    const selKey = role === 'A' ? 'draft_sel_a' : 'draft_sel_b';
    const confKey = role === 'A' ? 'draft_confirmed_a' : 'draft_confirmed_b';
    const handKey = role === 'A' ? 'hand_a' : 'hand_b';
    const pool = role === 'A' ? gs.pool_a : gs.pool_b;
    const sel = gs[selKey];
    if (sel.length !== HAND_SIZE) return;

    const hand = sel.map((id, idx) => ({ ...pool.find(p => p.id === id), selectionNumber: idx + 1 }));
    const { data } = await supabase.from('games').select('state').eq('room_code', roomCode).single();
    const latest = data.state;
    const otherConfirmed = role === 'A' ? latest.draft_confirmed_b : latest.draft_confirmed_a;
    const patch = {
      [confKey]: true,
      [handKey]: hand,
      phase: otherConfirmed ? 'play' : 'draft',
    };
    await updateState(patch);
  }, [gs, role, roomCode, updateState]);

  // ── Play actions ────────────────────────────────────────────────────────────
  const lastChoiceRef = useRef(null); // remember our card even after pendingChoiceRef clears

  const selectCard = useCallback(async (id) => {
    const key = role === 'A' ? 'chosen_a' : 'chosen_b';
    pendingChoiceRef.current = { key, id };
    lastChoiceRef.current = { key, id };
    setGs(prev => ({ ...prev, [key]: id }));
    // Atomic jsonb_set — only updates our field, never touches the other player's field
    await supabase.rpc('set_game_choice', { p_room_code: roomCode, p_key: key, p_value: id });
    pendingChoiceRef.current = null;
  }, [role, roomCode]);

  // Re-submit if our choice got wiped by a concurrent write
  useEffect(() => {
    if (!gs || !roomCode || !lastChoiceRef.current) return;
    if (gs.phase !== 'play' || gs.round_result) return;
    const { key, id } = lastChoiceRef.current;
    if (!gs[key]) {
      // Our choice is missing — re-submit atomically
      supabase.rpc('set_game_choice', { p_room_code: roomCode, p_key: key, p_value: id });
      setGs(prev => ({ ...prev, [key]: id }));
    }
  }, [gs?.chosen_a, gs?.chosen_b, gs?.phase, gs?.round_result, roomCode]);

  const confirmCard = useCallback(() => {
    // Selection already pushed to Supabase in selectCard; nothing more needed.
    // Role A's useEffect will resolve when both are set.
  }, []);

  const autoPlayCard = useCallback(() => {
    if (!gs) return;
    const hand = role === 'A' ? gs.hand_a : gs.hand_b;
    const used = role === 'A' ? gs.used_a : gs.used_b;
    const avail = hand.filter(p => !used.includes(p.id));
    if (!avail.length) return;
    const pick = avail[Math.floor(Math.random() * avail.length)].id;
    selectCard(pick);
  }, [gs, role, selectCard]);

  // ── Round navigation ─────────────────────────────────────────────────────────
  const nextRound = useCallback(async () => {
    // Fresh read only for question_index + used counts (these are safe to read once)
    const { data } = await supabase.from('games').select('state').eq('room_code', roomCode).single();
    if (!data) return;
    const latest = data.state;
    const nextQIndex = latest.question_index + 1;
    const allUsed = latest.used_a.length >= HAND_SIZE;
    const outOfQ = nextQIndex >= latest.questions.length;
    const patch = allUsed || outOfQ
      ? { phase: 'gameover', chosen_a: null, chosen_b: null, round_result: null, ready_next_a: false, ready_next_b: false }
      : { phase: 'play', question_index: nextQIndex, chosen_a: null, chosen_b: null, round_result: null, ready_next_a: false, ready_next_b: false };
    // Use atomic patch — merges only these fields without touching anything else
    await supabase.rpc('patch_game_state', { p_room_code: roomCode, p_patch: patch });
  }, [roomCode]);

  // ── Ready-next coordination ──────────────────────────────────────────────────
  const readyNextRef = useRef(false); // prevent double nextRound call

  const readyNext = useCallback(async () => {
    if (!roomCode) return;
    const key = role === 'A' ? 'ready_next_a' : 'ready_next_b';
    // Atomic patch — only sets our flag, never touches the other player's flag
    await supabase.rpc('patch_game_state', { p_room_code: roomCode, p_patch: { [key]: true } });
  }, [role, roomCode]);

  // Role A: advance when both ready
  useEffect(() => {
    if (role !== 'A' || !gs) return;
    if (!gs.ready_next_a || !gs.ready_next_b) return;
    if (readyNextRef.current) return;
    readyNextRef.current = true;
    nextRound();
  }, [gs?.ready_next_a, gs?.ready_next_b, role]);

  // Reset readyNextRef when entering new round
  useEffect(() => {
    if (gs?.phase === 'play' || gs?.phase === 'gameover') readyNextRef.current = false;
  }, [gs?.phase]);

  const goToGameOver = useCallback(() => updateState({ phase: 'gameover' }), [updateState]);
  const resetGame = useCallback(() => { setGs(null); setRoomCode(null); setRole(null); }, []);

  // ── Derive local phase for existing UI components ───────────────────────────
  const phase = (() => {
    if (!gs) return 'loading';
    const p = gs.phase;
    if (p === 'waiting-for-b') return 'waiting-for-b';
    if (p === 'draft') {
      const myConfirmed = role === 'A' ? gs.draft_confirmed_a : gs.draft_confirmed_b;
      return myConfirmed ? 'draft-waiting' : (role === 'A' ? 'draft-A' : 'draft-B');
    }
    if (p === 'play') {
      const myChosen = role === 'A' ? gs.chosen_a : gs.chosen_b;
      return myChosen ? 'play-waiting' : (role === 'A' ? 'play-select-A' : 'play-select-B');
    }
    return p; // reveal, reveal-final, gameover
  })();

  // ── Pool/hand for current player ─────────────────────────────────────────────
  const myPool = gs ? (role === 'A' ? gs.pool_a : gs.pool_b) : [];
  const myHand = gs ? (role === 'A' ? gs.hand_a : gs.hand_b) : [];
  const oppHand = gs ? (role === 'A' ? gs.hand_b : gs.hand_a) : [];
  const myDraftSel = gs ? (role === 'A' ? gs.draft_sel_a : gs.draft_sel_b) : [];
  const usedASet = new Set(gs?.used_a || []);
  const usedBSet = new Set(gs?.used_b || []);

  return {
    // meta
    isOnline: true,
    roomCode,
    role,
    lobbyError,
    playerA: gs?.player_a ?? '',
    playerB: gs?.player_b ?? '',
    waitingForOpponent: phase === 'waiting-for-b' || phase === 'draft-waiting' || phase === 'play-waiting',
    oppDraftDone: role === 'A' ? (gs?.draft_confirmed_b ?? false) : (gs?.draft_confirmed_a ?? false),
    oppCardSelected: role === 'A' ? !!gs?.chosen_b : !!gs?.chosen_a,
    createGame,
    joinGame,

    // mirror useGameState interface
    phase,
    WIN_SCORE,
    HAND_SIZE,
    poolA: myPool,
    poolB: myPool,
    handA: role === 'A' ? myHand : oppHand,
    handB: role === 'B' ? myHand : oppHand,
    usedA: usedASet,
    usedB: usedBSet,
    draftSelA: role === 'A' ? myDraftSel : [],
    draftSelB: role === 'B' ? myDraftSel : [],
    scoreA: gs?.score_a ?? 0,
    scoreB: gs?.score_b ?? 0,
    questions: gs?.questions ?? [],
    questionIndex: gs?.question_index ?? 0,
    currentQuestion: gs ? gs.questions[gs.question_index] : null,
    chosenA: role === 'A' ? gs?.chosen_a : gs?.chosen_b,
    chosenB: role === 'B' ? gs?.chosen_a : gs?.chosen_b,
    roundResult: gs?.round_result ?? null,
    roundHistory: gs?.round_history ?? [],

    // actions
    toggleDraftA: toggleDraft,
    toggleDraftB: toggleDraft,
    confirmDraftA: confirmDraft,
    confirmDraftB: confirmDraft,
    selectCardA: selectCard,
    selectCardB: selectCard,
    confirmCardA: confirmCard,
    confirmCardB: confirmCard,
    autoPlayCard,
    nextRound,
    readyNext,
    myReady: role === 'A' ? (gs?.ready_next_a ?? false) : (gs?.ready_next_b ?? false),
    oppReady: role === 'A' ? (gs?.ready_next_b ?? false) : (gs?.ready_next_a ?? false),
    goToGameOver,
    resetGame,
    onPlayersLoaded: () => {},
    startGame: () => {},
    playSuddenDeath: () => {},
  };
}
