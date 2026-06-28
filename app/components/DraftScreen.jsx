'use client';
import { useEffect, useState, useRef } from 'react';
import PlayerCard from './PlayerCard';
import Toast from './Toast';

const DRAFT_TIMER = 30;

export default function DraftScreen({ game, nameA, nameB }) {
  const { phase, poolA, poolB, draftSelA, draftSelB,
    toggleDraftA, toggleDraftB, confirmDraftA, confirmDraftB, HAND_SIZE,
    isOnline, oppDraftDone, playerA, playerB, role, draftStartedAt } = game;

  const isA = phase === 'draft-A';
  const pool = isA ? poolA : poolB;
  const selected = isA ? draftSelA : draftSelB;
  const toggle = isA ? toggleDraftA : toggleDraftB;
  const confirm = isA ? confirmDraftA : confirmDraftB;
  const playerLabel = isA ? nameA : nameB;
  // Always green — you're always selecting your own cards
  const accent = { text: 'text-green-400', border: 'border-green-800', bg: 'bg-green-950/40', btn: 'bg-green-600 hover:bg-green-500', timerBar: 'bg-green-500' };

  const getInitialDraftTime = () => {
    if (isOnline && draftStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(draftStartedAt).getTime()) / 1000);
      return Math.max(0, DRAFT_TIMER - elapsed);
    }
    return DRAFT_TIMER;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialDraftTime);
  const intervalRef = useRef(null);
  const selectedRef = useRef(selected);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  const autoConfirm = useRef(false);

  const handleAutoConfirm = () => {
    if (autoConfirm.current) return;
    autoConfirm.current = true;
    const current = selectedRef.current;
    const remaining = HAND_SIZE - current.length;
    if (remaining > 0) {
      const unselected = pool.filter(p => !current.includes(p.id));
      const shuffled = [...unselected].sort(() => Math.random() - 0.5);
      shuffled.slice(0, remaining).forEach(p => toggle(p.id));
    }
    setTimeout(() => confirm(), 100);
  };

  useEffect(() => {
    autoConfirm.current = false;
    setTimeLeft(getInitialDraftTime());
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleAutoConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const handleConfirm = () => {
    clearInterval(intervalRef.current);
    confirm();
  };

  const timerPct = (timeLeft / DRAFT_TIMER) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : accent.timerBar;

  const oppName = isOnline ? (role === 'A' ? playerB : playerA) : null;

  return (
    <div className="h-dvh bg-gray-950 text-white flex flex-col overflow-hidden">
      {isOnline && <Toast message={`✅ ${oppName} kadrosunu seçti!`} trigger={oppDraftDone} />}

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-3 py-2 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-black tracking-widest uppercase">Futbol Kart</h1>
          <p className="text-xs text-gray-400">Kadro Seçimi</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${timeLeft <= 5 ? 'border-red-500 bg-red-900/50' : accent.border + ' ' + accent.bg}`}>
            <span className={`font-black text-base ${timeLeft <= 5 ? 'text-red-400' : accent.text}`}>{timeLeft}</span>
          </div>
          <div className="text-right">
            <p className={`text-base font-black ${accent.text}`}>{playerLabel}</p>
            <p className="text-xs text-gray-400">{selected.length}/{HAND_SIZE} kart</p>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-gray-800 w-full shrink-0">
        <div className={`h-full transition-all duration-1000 ease-linear ${timerColor}`} style={{ width: `${timerPct}%` }} />
      </div>

      {/* Instruction */}
      <div className={`mx-3 mt-2 px-3 py-2 rounded-xl border shrink-0 ${accent.bg} ${accent.border}`}>
        <p className={`text-xs font-semibold ${accent.text}`}>
          {pool.length} karttan {HAND_SIZE} seç · Rakibin farklı kartlara sahip
        </p>
      </div>

      {/* Cards — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        <div className="grid grid-cols-3 gap-2 justify-items-center">
          {pool.map(p => {
            const idx = selected.indexOf(p.id);
            return (
              <PlayerCard
                key={p.id}
                player={p}
                selected={idx !== -1}
                selectionNumber={idx !== -1 ? idx + 1 : null}
                onClick={() => toggle(p.id)}
                size="sm"
              />
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="px-3 py-2 bg-gray-900 border-t border-gray-700 shrink-0">
        <button
          onClick={handleConfirm}
          disabled={selected.length !== HAND_SIZE}
          className={`w-full py-3 rounded-xl font-black text-base uppercase tracking-widest transition-all
            ${selected.length === HAND_SIZE
              ? `${accent.btn} text-white shadow-lg`
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {selected.length === HAND_SIZE
            ? `Kadroyu Onayla (${timeLeft}s) →`
            : `${HAND_SIZE - selected.length} kart daha seçin`}
        </button>
      </div>
    </div>
  );
}
