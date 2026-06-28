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

  // ── Supabase helpers ────────────────────────────────────────────────────────
  const updateState = useCallback(async (patch, code) => {
    const rc = code || roomCode;
    const { data } = await supabase
      .from('games').select('state').eq('room_code', rc).single();
    if (!data) return;
    const merged = { ...data.state, ...patch };
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
        payload => setGs(payload.new.state))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomCode]);

  // ── Role A: auto-resolve when both cards chosen ──────────────────────────────
  useEffect(() => {
    if (role !== 'A' || !gs) return;
    if (!gs.chosen_a || !gs.chosen_b || gs.round_result) return;
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    const cardA = gs.hand_a.find(p => p.id === gs.chosen_a);
    const cardB = gs.hand_b.find(p => p.id === gs.chosen_b);
    if (!cardA || !cardB) return;

    const question = gs.questions[gs.question_index];
    const winner = compareCards(cardA, cardB, question);
    const newScoreA = winner === 'A' ? gs.score_a + 1 : gs.score_a;
    const newScoreB = winner === 'B' ? gs.score_b + 1 : gs.score_b;
    const result = {
      winner, cardA, cardB, question,
      valA: getVal(cardA, question.field),
      valB: getVal(cardB, question.field),
    };
    const isFinal = newScoreA >= WIN_SCORE || newScoreB >= WIN_SCORE;
    updateState({
      round_result: result,
      round_history: [...gs.round_history, result],
      used_a: [...gs.used_a, gs.chosen_a],
      used_b: [...gs.used_b, gs.chosen_b],
      score_a: newScoreA,
      score_b: newScoreB,
      phase: isFinal ? 'reveal-final' : 'reveal',
    });
  }, [gs?.chosen_a, gs?.chosen_b, gs?.round_result, role]);

  // ── Reset resolve guard on new round ────────────────────────────────────────
  useEffect(() => {
    if (gs?.phase === 'play') resolvedRef.current = false;
  }, [gs?.phase]);

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
    const { data, error } = await supabase.from('games').select('state').eq('room_code', code.toUpperCase()).single();
    if (error || !data) { setLobbyError('Oda bulunamadı. Kodu kontrol et.'); return; }
    if (data.state.player_b) { setLobbyError('Bu oda dolu.'); return; }
    if (data.state.phase !== 'waiting-for-b') { setLobbyError('Oyun zaten başlamış.'); return; }
    const patch = { player_b: nameB, phase: 'draft' };
    await updateState(patch, code.toUpperCase());
    setRoomCode(code.toUpperCase());
    setRole('B');
    setGs({ ...data.state, ...patch });
  }, [updateState]);

  // ── Draft actions ────────────────────────────────────────────────────────────
  const toggleDraft = useCallback((id) => {
    if (!gs || !role) return;
    const key = role === 'A' ? 'draft_sel_a' : 'draft_sel_b';
    const current = gs[key];
    const next = current.includes(id)
      ? current.filter(x => x !== id)
      : current.length < HAND_SIZE ? [...current, id] : current;
    setGs(prev => ({ ...prev, [key]: next }));
    updateState({ [key]: next });
  }, [gs, role, updateState]);

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
  const selectCard = useCallback((id) => {
    const key = role === 'A' ? 'chosen_a' : 'chosen_b';
    setGs(prev => ({ ...prev, [key]: id }));
    updateState({ [key]: id });
  }, [role, updateState]);

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
    if (!gs) return;
    const nextQIndex = gs.question_index + 1;
    const allUsed = gs.used_a.length >= HAND_SIZE;
    const outOfQ = nextQIndex >= gs.questions.length;

    if (allUsed || outOfQ) {
      await updateState({ phase: 'gameover', chosen_a: null, chosen_b: null, round_result: null });
    } else {
      await updateState({ phase: 'play', question_index: nextQIndex, chosen_a: null, chosen_b: null, round_result: null });
    }
  }, [gs, updateState]);

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
    waitingForOpponent: phase === 'waiting-for-b' || phase === 'draft-waiting' || phase === 'play-waiting',
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
    usedA: role === 'A' ? usedASet : usedBSet,
    usedB: role === 'B' ? usedASet : usedBSet,
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
    goToGameOver,
    resetGame,
    onPlayersLoaded: () => {},
    startGame: () => {},
    playSuddenDeath: () => {},
  };
}
