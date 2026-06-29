'use client';
import { useState, useCallback } from 'react';
import { pickQuestions, getVal, compareCards, buildBalancedPools } from '../lib/gameUtils';

const WIN_SCORE = 3;
const POOL_SIZE = 10;
const HAND_SIZE = 5;




export function useGameState(allPlayers) {
  const [phase, setPhase] = useState('loading');
  const [poolA, setPoolA] = useState([]);
  const [poolB, setPoolB] = useState([]);
  // Full hands — never emptied, cards marked used instead
  const [handA, setHandA] = useState([]);
  const [handB, setHandB] = useState([]);
  const [usedA, setUsedA] = useState(new Set());
  const [usedB, setUsedB] = useState(new Set());
  const [draftSelA, setDraftSelA] = useState([]);
  const [draftSelB, setDraftSelB] = useState([]);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chosenA, setChosenA] = useState(null);
  const [chosenB, setChosenB] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [roundHistory, setRoundHistory] = useState([]);

  const onPlayersLoaded = useCallback(() => setPhase('name'), []);

  const startGame = useCallback(() => {
    if (allPlayers.length < 20) return;
    const [pA, pB] = buildBalancedPools(allPlayers, POOL_SIZE);
    setPoolA(pA);
    setPoolB(pB);
    setQuestions(pickQuestions(5, [...pA, ...pB]));
    setQuestionIndex(0);
    setHandA([]); setHandB([]);
    setUsedA(new Set()); setUsedB(new Set());
    setDraftSelA([]); setDraftSelB([]);
    setScoreA(0); setScoreB(0);
    setChosenA(null); setChosenB(null);
    setRoundResult(null); setRoundHistory([]);
    setPhase('draft-A');
  }, [allPlayers]);

  const toggleDraftA = useCallback((id) => {
    setDraftSelA(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length < HAND_SIZE ? [...prev, id] : prev
    );
  }, []);

  const toggleDraftB = useCallback((id) => {
    setDraftSelB(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length < HAND_SIZE ? [...prev, id] : prev
    );
  }, []);

  const confirmDraftA = useCallback(() => {
    if (draftSelA.length !== HAND_SIZE) return;
    setHandA(draftSelA.map((id, idx) => ({ ...poolA.find(p => p.id === id), selectionNumber: idx + 1 })));
    setPhase('draft-B');
  }, [draftSelA, poolA]);

  const confirmDraftB = useCallback(() => {
    if (draftSelB.length !== HAND_SIZE) return;
    setHandB(draftSelB.map((id, idx) => ({ ...poolB.find(p => p.id === id), selectionNumber: idx + 1 })));
    setPhase('play-select-A');
  }, [draftSelB, poolB]);

  const selectCardA = useCallback((id) => setChosenA(id), []);
  const confirmCardA = useCallback(() => {
    if (!chosenA) return;
    setPhase('play-select-B');
  }, [chosenA]);

  const selectCardB = useCallback((id) => setChosenB(id), []);

  // autoIdA / autoIdB used when timer expires
  const resolveRound = useCallback((idA, idB) => {
    const hand_A = handA.length ? handA : [];
    const hand_B = handB.length ? handB : [];
    const cardA = hand_A.find(p => p.id === idA);
    const cardB = hand_B.find(p => p.id === idB);
    if (!cardA || !cardB) return;

    const question = questions[questionIndex];
    const winner = compareCards(cardA, cardB, question);
    const result = {
      winner, cardA, cardB, question,
      valA: getVal(cardA, question.field),
      valB: getVal(cardB, question.field),
      numA: cardA.selectionNumber,
      numB: cardB.selectionNumber,
    };
    setRoundResult(result);
    setRoundHistory(prev => [...prev, result]);
    setUsedA(prev => new Set([...prev, idA]));
    setUsedB(prev => new Set([...prev, idB]));

    const newScoreA = winner === 'A' ? scoreA + 1 : scoreA;
    const newScoreB = winner === 'B' ? scoreB + 1 : scoreB;
    setScoreA(newScoreA);
    setScoreB(newScoreB);

    if (newScoreA >= WIN_SCORE || newScoreB >= WIN_SCORE) {
      setPhase('reveal-final');
    } else {
      setPhase('reveal');
    }
  }, [handA, handB, questions, questionIndex, scoreA, scoreB]);

  const confirmCardB = useCallback((autoIdA, autoIdB) => {
    const idA = autoIdA || chosenA;
    const idB = autoIdB || chosenB;
    if (!idA || !idB) return;
    resolveRound(idA, idB);
  }, [chosenA, chosenB, resolveRound]);

  // Called by timer expiry in PlayScreen
  const autoPlayCard = useCallback((phase, currentChosenA, currentChosenB) => {
    const availA = handA.filter(p => !usedA.has(p.id));
    const availB = handB.filter(p => !usedB.has(p.id));
    if (!availA.length || !availB.length) return;

    if (phase === 'play-select-A') {
      const autoA = availA[Math.floor(Math.random() * availA.length)].id;
      setChosenA(autoA);
      setPhase('play-select-B');
    } else {
      const idA = currentChosenA || availA[Math.floor(Math.random() * availA.length)].id;
      const autoB = availB[Math.floor(Math.random() * availB.length)].id;
      setChosenA(idA);
      setChosenB(autoB);
      resolveRound(idA, autoB);
    }
  }, [handA, handB, usedA, usedB, resolveRound]);

  const nextRound = useCallback(() => {
    const nextQIndex = questionIndex + 1;
    setChosenA(null);
    setChosenB(null);
    setRoundResult(null);

    const allUsed = usedA.size >= HAND_SIZE;
    const outOfQuestions = nextQIndex >= questions.length;

    if (allUsed || outOfQuestions) {
      setPhase('gameover');
      return;
    }
    setQuestionIndex(nextQIndex);
    setPhase('play-select-A');
  }, [questionIndex, questions, usedA, scoreA, scoreB]);

  // Sudden death: auto-play one random card from each pool remainder
  const playSuddenDeath = useCallback(() => {
    const remainA = poolA.filter(p => !handA.find(h => h.id === p.id));
    const remainB = poolB.filter(p => !handB.find(h => h.id === p.id));
    const sdCardA = { ...(remainA.length ? remainA[Math.floor(Math.random() * remainA.length)] : handA[0]), selectionNumber: '★' };
    const sdCardB = { ...(remainB.length ? remainB[Math.floor(Math.random() * remainB.length)] : handB[0]), selectionNumber: '★' };

    const nextQIndex = questionIndex + 1 < questions.length ? questionIndex + 1 : 0;
    const question = questions[nextQIndex] || questions[0];
    const winner = compareCards(sdCardA, sdCardB, question);

    const newScoreA = winner === 'A' ? scoreA + 1 : scoreA;
    const newScoreB = winner === 'B' ? scoreB + 1 : scoreB;
    setScoreA(newScoreA);
    setScoreB(newScoreB);

    const result = {
      winner, cardA: sdCardA, cardB: sdCardB, question,
      valA: getVal(sdCardA, question.field),
      valB: getVal(sdCardB, question.field),
      numA: '★', numB: '★', isSuddenDeath: true,
    };
    setRoundResult(result);
    setRoundHistory(prev => [...prev, result]);

    // If still draw after sudden death, just go to gameover
    setPhase(winner === 'draw' ? 'gameover' : 'reveal-final');
  }, [poolA, poolB, handA, handB, questions, questionIndex, scoreA, scoreB]);

  const goToGameOver = useCallback(() => setPhase('gameover'), []);

  const resetGame = useCallback(() => setPhase('name'), []);

  return {
    phase, WIN_SCORE, HAND_SIZE,
    poolA, poolB,
    handA, handB, usedA, usedB,
    draftSelA, draftSelB,
    scoreA, scoreB,
    questions, questionIndex,
    currentQuestion: questions[questionIndex] || null,
    chosenA, chosenB,
    roundResult, roundHistory,
    onPlayersLoaded, startGame,
    toggleDraftA, toggleDraftB,
    confirmDraftA, confirmDraftB,
    selectCardA, confirmCardA,
    selectCardB, confirmCardB,
    autoPlayCard, playSuddenDeath,
    nextRound, goToGameOver, resetGame,
    // local: readyNext is just nextRound (no coordination needed)
    readyNext: nextRound,
    myReady: false,
    oppReady: false,
  };
}
