'use client';
import { useEffect, useState } from 'react';

export function saveResult(nameA, nameB, scoreA, scoreB) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('fko_leaderboard');
  const board = raw ? JSON.parse(raw) : {};

  const update = (name, won, score, opponentScore) => {
    if (!board[name]) board[name] = { name, wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0 };
    board[name].goalsFor += score;
    board[name].goalsAgainst += opponentScore;
    if (won === 'win') board[name].wins++;
    else if (won === 'loss') board[name].losses++;
    else board[name].draws++;
  };

  const result = scoreA > scoreB ? 'win' : scoreB > scoreA ? 'loss' : 'draw';
  update(nameA, result, scoreA, scoreB);
  update(nameB, result === 'win' ? 'loss' : result === 'loss' ? 'win' : 'draw', scoreB, scoreA);

  localStorage.setItem('fko_leaderboard', JSON.stringify(board));
}

export default function LeaderboardScreen({ onBack }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('fko_leaderboard');
    if (!raw) return;
    const board = JSON.parse(raw);
    const sorted = Object.values(board).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    });
    setEntries(sorted);
  }, []);

  const clearBoard = () => {
    localStorage.removeItem('fko_leaderboard');
    setEntries([]);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-5 pt-8 gap-5">
      <div className="text-center">
        <p className="text-4xl mb-2">🏅</p>
        <h2 className="text-3xl font-black uppercase tracking-widest text-yellow-400">Sıralama</h2>
        <p className="text-gray-500 text-xs mt-1">Tüm zamanlar</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">Henüz sonuç yok.</p>
          <p className="text-gray-700 text-sm mt-1">Bir oyun oynayın!</p>
        </div>
      ) : (
        <div className="w-full max-w-lg flex flex-col gap-2">
          {/* Header */}
          <div className="grid grid-cols-12 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span className="col-span-1">#</span>
            <span className="col-span-4">İsim</span>
            <span className="col-span-2 text-center text-green-500">G</span>
            <span className="col-span-2 text-center text-red-500">M</span>
            <span className="col-span-2 text-center text-yellow-500">B</span>
            <span className="col-span-1 text-center text-gray-400">AV</span>
          </div>

          {entries.map((e, i) => (
            <div
              key={e.name}
              className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl border transition-all
                ${i === 0 ? 'bg-yellow-950/40 border-yellow-700' : i === 1 ? 'bg-gray-700/30 border-gray-600' : i === 2 ? 'bg-orange-950/30 border-orange-900' : 'bg-gray-900 border-gray-800'}`}
            >
              <span className="col-span-1 text-lg">{medals[i] ?? `${i + 1}`}</span>
              <span className="col-span-4 font-black text-white truncate">{e.name}</span>
              <span className="col-span-2 text-center font-bold text-green-400">{e.wins}</span>
              <span className="col-span-2 text-center font-bold text-red-400">{e.losses}</span>
              <span className="col-span-2 text-center font-bold text-yellow-400">{e.draws}</span>
              <span className="col-span-1 text-center text-xs text-gray-400">
                {e.goalsFor - e.goalsAgainst > 0 ? '+' : ''}{e.goalsFor - e.goalsAgainst}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 w-full max-w-lg">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
        >
          ← Geri
        </button>
        {entries.length > 0 && (
          <button
            onClick={clearBoard}
            className="px-4 py-3 bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-700 rounded-xl font-bold text-xs text-gray-500 hover:text-red-400 transition-all"
          >
            Sıfırla
          </button>
        )}
      </div>
    </div>
  );
}
