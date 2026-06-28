'use client';
import { useEffect, useState, useRef } from 'react';
import PlayerCard from './PlayerCard';
import Toast from './Toast';

const TIMER_SECONDS = 20;

export default function PlayScreen({ game, nameA, nameB }) {
  const {
    phase, scoreA, scoreB, WIN_SCORE,
    handA, handB, usedA, usedB,
    chosenA, chosenB,
    currentQuestion,
    selectCardA, confirmCardA,
    selectCardB, confirmCardB,
    autoPlayCard,
    isOnline, oppCardSelected, playerA, playerB, role,
    playStartedAt,
  } = game;

  const isA = phase === 'play-select-A';
  const hand = isA ? handA : handB;
  const used = isA ? usedA : usedB;
  const chosen = isA ? chosenA : chosenB;
  const availableHand = hand.filter(p => !used.has(p.id));
  const select = isA ? selectCardA : selectCardB;
  const playerLabel = isA ? nameA : nameB;

  // Always green — you're always selecting your own cards
  const accent = { text: 'text-green-400', border: 'border-green-800', bg: 'bg-green-950/40', btn: 'bg-green-600 hover:bg-green-500', timerBg: 'bg-green-900/40', timerBar: 'bg-green-500' };

  // Scoreboard: "me" = green, opponent = red
  // Online: role tells us which side we are. Local: current turn player is "me".
  const iAmA = isOnline ? role === 'A' : isA;
  const myScoreColor   = 'text-green-300';
  const oppScoreColor  = 'text-red-300';
  const myNameColor    = 'text-green-400';
  const oppNameColor   = 'text-red-400';
  const aNameCls  = iAmA ? myNameColor  : oppNameColor;
  const bNameCls  = iAmA ? oppNameColor : myNameColor;
  const aScoreCls = iAmA ? myScoreColor : oppScoreColor;
  const bScoreCls = iAmA ? oppScoreColor : myScoreColor;

  // Timer — synced to server timestamp so rejoining shows correct remaining time
  const getInitialTime = () => {
    if (isOnline && playStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(playStartedAt).getTime()) / 1000);
      return Math.max(0, TIMER_SECONDS - elapsed);
    }
    return TIMER_SECONDS;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime);
  const intervalRef = useRef(null);
  const autoPlayCardRef = useRef(autoPlayCard);
  useEffect(() => { autoPlayCardRef.current = autoPlayCard; }, [autoPlayCard]);

  useEffect(() => {
    setTimeLeft(getInitialTime());
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          autoPlayCardRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const handleConfirm = () => {
    clearInterval(intervalRef.current);
    if (isA) confirmCardA();
    else confirmCardB();
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 6 ? 'bg-yellow-500' : accent.timerBar;

  const oppName = isOnline ? (role === 'A' ? playerB : playerA) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {isOnline && <Toast message={`⚡ ${oppName} kartını seçti!`} trigger={oppCardSelected} />}
      {/* Scoreboard */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="text-center">
            <p className={`${aNameCls} font-black text-xs uppercase tracking-wider`}>{nameA}</p>
            <p className={`text-3xl font-black ${aScoreCls}`}>{scoreA}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-gray-500 text-xs">ilk {WIN_SCORE} kazanır</p>
            <p className="text-gray-600 text-xs">{availableHand.length} kart kaldı</p>
          </div>
          <div className="text-center">
            <p className={`${bNameCls} font-black text-xs uppercase tracking-wider`}>{nameB}</p>
            <p className={`text-3xl font-black ${bScoreCls}`}>{scoreB}</p>
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

      {/* Question */}
      {currentQuestion && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-center">
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-1">Soru</p>
          <p className="text-white font-bold text-sm leading-snug">{currentQuestion.text}</p>
          <p className="text-gray-500 text-xs mt-1">
            {currentQuestion.higher_wins ? '↑ Yüksek değer kazanır' : '↓ Düşük değer kazanır'}
          </p>
        </div>
      )}

      {/* Turn + Timer countdown */}
      <div className={`mx-4 mt-2 px-4 py-2 rounded-xl border ${accent.bg} ${accent.border} flex items-center justify-between`}>
        <p className={`font-bold text-sm ${accent.text}`}>
          {playerLabel} — kartını seç
        </p>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${timeLeft <= 3 ? 'border-red-500 bg-red-900/50' : accent.border + ' ' + accent.bg}`}>
          <span className={`font-black text-lg ${timeLeft <= 3 ? 'text-red-400' : accent.text}`}>{timeLeft}</span>
        </div>
      </div>

      {/* Hand — all cards, used ones grayed */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-wrap gap-3 justify-center">
          {hand.map(p => {
            const isUsed = used.has(p.id);
            const isChosen = chosen === p.id;
            return (
              <div key={p.id} className="relative">
                <PlayerCard
                  player={p}
                  selected={isChosen}
                  selectionNumber={isChosen ? p.selectionNumber : null}
                  onClick={isUsed ? undefined : () => select(p.id)}
                  size="md"
                  dimmed={isUsed}
                />
                {isUsed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl opacity-60">✗</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
        <button
          onClick={handleConfirm}
          disabled={!chosen}
          className={`w-full py-3 rounded-xl font-black text-lg uppercase tracking-widest transition-all
            ${chosen ? `${accent.btn} text-white shadow-lg` : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {chosen ? `Onayla (${timeLeft}s) →` : 'Bir kart seç'}
        </button>
      </div>
    </div>
  );
}
