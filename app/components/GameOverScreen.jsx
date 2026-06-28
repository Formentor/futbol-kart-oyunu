'use client';
import { useEffect, useRef, useState } from 'react';
import { saveResult } from './LeaderboardScreen';

export default function GameOverScreen({ game, nameA, nameB, onLeaderboard, role, isOnline }) {
  const { scoreA, scoreB, roundHistory, resetGame, WIN_SCORE } = game;
  const saved = useRef(false);
  const [step, setStep] = useState(0); // 0=hidden 1=scores 2=winner 3=confetti 4=summary

  useEffect(() => {
    if (!saved.current) {
      saveResult(nameA, nameB, scoreA, scoreB);
      saved.current = true;
    }
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1000),
      setTimeout(() => setStep(3), 1600),
      setTimeout(() => setStep(4), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isDraw = scoreA === scoreB;
  const winnerName = scoreA > scoreB ? nameA : scoreB > scoreA ? nameB : null;
  const winnerSide = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : null;

  // Perspective-aware colors: own = green, opponent = red
  // Online: use role. Local: winner = green, loser = red.
  const getNameCls = (side) => {
    if (isOnline) return side === role ? 'text-green-400' : 'text-red-400';
    if (isDraw) return 'text-yellow-400';
    return winnerSide === side ? 'text-green-400' : 'text-red-400';
  };
  const getScoreCls = (side) => {
    if (isOnline) return side === role ? 'text-green-300' : 'text-red-300';
    if (isDraw) return 'text-gray-300';
    return winnerSide === side ? 'text-green-300' : 'text-red-300';
  };
  const getWinnerCls = () => {
    if (isDraw) return 'text-yellow-400';
    if (isOnline) return winnerSide === role ? 'text-green-400' : 'text-red-400';
    return 'text-green-400';
  };
  const getHistoryCls = (side) => {
    if (isOnline) return side === role ? 'text-green-300' : 'text-red-300';
    return side === 'A' ? 'text-green-300' : 'text-red-300';
  };
  const getHistoryWinnerCls = (rWinner) => {
    if (rWinner === 'draw') return 'text-yellow-400';
    if (isOnline) return rWinner === role ? 'text-green-400' : 'text-red-400';
    return rWinner === 'A' ? 'text-green-400' : 'text-red-400';
  };

  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    color: ['#facc15', '#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'][i % 6],
    size: 6 + Math.random() * 8,
    dur: `${0.9 + Math.random() * 0.8}s`,
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-5 p-5 pt-8 overflow-hidden relative">

      {/* Confetti */}
      {step >= 3 && !isDraw && (
        <div className="pointer-events-none fixed inset-0 z-10">
          <style>{`
            @keyframes confettiFall {
              0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
              80%  { opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
          {particles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: 0,
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: p.id % 3 === 0 ? '50%' : 2,
                background: p.color,
                animation: `confettiFall ${p.dur} ${p.delay} ease-in forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Scores — slide in */}
      <div className={`flex items-center gap-6 bg-gray-900 px-10 py-5 rounded-2xl border border-gray-700 transition-all duration-700
        ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transitionDelay: '0ms' }}
      >
        <div className={`text-center transition-transform duration-500 ${step >= 2 && winnerSide === 'A' ? 'scale-125' : step >= 2 && winnerSide === 'B' ? 'scale-75 opacity-40' : ''}`}>
          <p className={`${getNameCls('A')} text-sm font-bold uppercase tracking-wider mb-1`}>{nameA}</p>
          <p className={`text-6xl font-black ${step >= 2 ? getScoreCls('A') : 'text-gray-300'}`}>{scoreA}</p>
        </div>
        <div className="text-gray-600 font-black text-3xl">—</div>
        <div className={`text-center transition-transform duration-500 ${step >= 2 && winnerSide === 'B' ? 'scale-125' : step >= 2 && winnerSide === 'A' ? 'scale-75 opacity-40' : ''}`}>
          <p className={`${getNameCls('B')} text-sm font-bold uppercase tracking-wider mb-1`}>{nameB}</p>
          <p className={`text-6xl font-black ${step >= 2 ? getScoreCls('B') : 'text-gray-300'}`}>{scoreB}</p>
        </div>
      </div>

      {/* Winner banner — pop in */}
      <div className={`text-center transition-all duration-500
        ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transitionDelay: step >= 2 ? '0ms' : '0ms' }}
      >
        <p className={`text-6xl mb-3 ${step >= 3 ? 'animate-bounce' : ''}`}>
          {isDraw ? '🤝' : '🏆'}
        </p>
        <h2 className={`text-4xl font-black uppercase tracking-widest ${getWinnerCls()}`}>
          {isDraw ? 'Beraberlik!' : `${winnerName} Kazandı!`}
        </h2>
        {!isDraw && (
          <p className="text-sm font-bold mt-1 text-red-400">
            {winnerSide === 'A' ? nameB : nameA} kaybetti
          </p>
        )}
        <p className="text-gray-600 text-xs mt-1">İlk {WIN_SCORE} eli kazanma hedefi</p>
      </div>

      {/* Round summary — fade in last */}
      {step >= 4 && roundHistory.length > 0 && (
        <div className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700 overflow-hidden animate-fade-in">
          <p className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-800 border-b border-gray-700">
            El Özeti
          </p>
          {roundHistory.map((r, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-800 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-bold">Soru {i + 1}</span>
                <span className={`text-xs font-black ${getHistoryWinnerCls(r.winner)}`}>
                  {r.winner === 'draw' ? 'Berabere' : r.winner === 'A' ? `${nameA} ✓` : `${nameB} ✓`}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-1.5">{r.question?.text}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`${r.winner === 'A' ? `${getHistoryCls('A')} font-bold` : 'text-gray-500'}`}>{r.cardA?.name} ({r.valA})</span>
                <span className="text-gray-700">vs</span>
                <span className={`${r.winner === 'B' ? `${getHistoryCls('B')} font-bold` : 'text-gray-500'}`}>{r.cardB?.name} ({r.valB})</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step >= 4 && (
        <div className="flex gap-3 w-full max-w-lg">
          <button
            onClick={resetGame}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:scale-105"
          >
            Yeniden Oyna
          </button>
          <button
            onClick={onLeaderboard}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl font-bold text-sm uppercase tracking-widest transition-all text-gray-300"
          >
            🏅 Sıralama
          </button>
        </div>
      )}
    </div>
  );
}
