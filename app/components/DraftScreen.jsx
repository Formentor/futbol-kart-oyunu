'use client';
import { useEffect, useState, useRef } from 'react';
import PlayerCard from './PlayerCard';
import Toast from './Toast';

const DRAFT_TIMER = 30;

export default function DraftScreen({ game, nameA, nameB }) {
  const { phase, poolA, poolB, draftSelA, draftSelB,
    toggleDraftA, toggleDraftB, confirmDraftA, confirmDraftB, HAND_SIZE,
    isOnline, oppDraftDone, playerA, playerB, role } = game;

  const isA = phase === 'draft-A';
  const pool = isA ? poolA : poolB;
  const selected = isA ? draftSelA : draftSelB;
  const toggle = isA ? toggleDraftA : toggleDraftB;
  const confirm = isA ? confirmDraftA : confirmDraftB;
  const playerLabel = isA ? nameA : nameB;
  const accent = isA
    ? { text: 'text-blue-400', border: 'border-blue-800', bg: 'bg-blue-950/40', btn: 'bg-blue-600 hover:bg-blue-500', timerBar: 'bg-blue-500' }
    : { text: 'text-red-400', border: 'border-red-800', bg: 'bg-red-950/40', btn: 'bg-red-600 hover:bg-red-500', timerBar: 'bg-red-500' };

  const [timeLeft, setTimeLeft] = useState(DRAFT_TIMER);
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
    setTimeLeft(DRAFT_TIMER);
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {isOnline && <Toast message={`✅ ${oppName} kadrosunu seçti!`} trigger={oppDraftDone} />}
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase">Futbol Kart Oyunu</h1>
          <p className="text-sm text-gray-400">Kadro Seçimi</p>
        </div>
        <div className="text-right flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${timeLeft <= 5 ? 'border-red-500 bg-red-900/50' : accent.border + ' ' + accent.bg}`}>
            <span className={`font-black text-lg ${timeLeft <= 5 ? 'text-red-400' : accent.text}`}>{timeLeft}</span>
          </div>
          <div>
            <p className={`text-xl font-black ${accent.text}`}>{playerLabel}</p>
            <p className="text-sm text-gray-400">{selected.length}/{HAND_SIZE} kart</p>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-gray-800 w-full">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Instruction */}
      <div className={`mx-4 mt-4 px-4 py-3 rounded-xl border ${accent.bg} ${accent.border}`}>
        <p className={`font-semibold ${accent.text}`}>
          {playerLabel}, {pool.length} kartınızdan {HAND_SIZE} tanesini seçin.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Rakibinizin farklı kartları var — seçimleriniz el fazına kadar gizlidir.
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {pool.map(p => {
            const idx = selected.indexOf(p.id);
            return (
              <PlayerCard
                key={p.id}
                player={p}
                selected={idx !== -1}
                selectionNumber={idx !== -1 ? idx + 1 : null}
                onClick={() => toggle(p.id)}
                size="md"
              />
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="px-4 py-4 bg-gray-900 border-t border-gray-700">
        <button
          onClick={handleConfirm}
          disabled={selected.length !== HAND_SIZE}
          className={`w-full py-3 rounded-xl font-black text-lg uppercase tracking-widest transition-all
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
