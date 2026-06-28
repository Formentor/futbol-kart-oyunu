'use client';
import { useEffect, useRef } from 'react';
import { saveResult } from './LeaderboardScreen';

const QUESTION_LABELS = {
  international_goals: 'Milli Gol',
  birthplace_population: 'Doğum Şehri Nüfusu',
  career_cards_total: 'Kariyer Kartı',
  longest_club_tenure_years: 'En Uzun Kulüp',
  career_goals_total: 'Kariyer Golü',
  pro_debut_age: 'Debut Yaşı',
  countries_played_count: 'Ülke Sayısı',
  career_assists_total: 'Kariyer Asisti',
  highest_transfer_fee_m: 'En Pahalı Transfer',
  club_titles_total: 'Kulüp Şampiyonluğu',
};

export default function GameOverScreen({ game, nameA, nameB, onLeaderboard }) {
  const { scoreA, scoreB, roundHistory, resetGame, WIN_SCORE } = game;
  const saved = useRef(false);

  useEffect(() => {
    if (!saved.current) {
      saveResult(nameA, nameB, scoreA, scoreB);
      saved.current = true;
    }
  }, []);

  const isDraw = scoreA === scoreB;
  const winner = scoreA > scoreB ? nameA : scoreB > scoreA ? nameB : null;
  const winnerColor = scoreA > scoreB ? 'text-blue-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-5 p-5 pt-8">
      {/* Trophy */}
      <div className="text-center">
        <p className="text-6xl mb-2">{isDraw ? '🤝' : '🏆'}</p>
        <h2 className={`text-4xl font-black uppercase tracking-widest ${isDraw ? 'text-yellow-400' : winnerColor}`}>
          {isDraw ? 'Beraberlik!' : `${winner} Kazandı!`}
        </h2>
        <p className="text-gray-500 text-sm mt-1">İlk {WIN_SCORE} eli kazanma hedefi</p>
      </div>

      {/* Score */}
      <div className="flex items-center gap-6 bg-gray-900 px-10 py-5 rounded-2xl border border-gray-700">
        <div className="text-center">
          <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">{nameA}</p>
          <p className="text-6xl font-black text-blue-300">{scoreA}</p>
        </div>
        <div className="text-gray-600 font-black text-3xl">—</div>
        <div className="text-center">
          <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-1">{nameB}</p>
          <p className="text-6xl font-black text-red-300">{scoreB}</p>
        </div>
      </div>

      {/* Round history */}
      {roundHistory.length > 0 && (
        <div className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <p className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-800 border-b border-gray-700">
            El Özeti
          </p>
          {roundHistory.map((r, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-800 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-bold">Soru {i + 1}</span>
                <span className={`text-xs font-black ${r.winner === 'A' ? 'text-blue-400' : r.winner === 'B' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {r.winner === 'draw' ? 'Berabere' : r.winner === 'A' ? `${nameA} ✓` : `${nameB} ✓`}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-1.5">{r.question?.text}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`${r.winner === 'A' ? 'text-blue-300 font-bold' : 'text-gray-500'}`}>{r.cardA?.name} ({r.valA})</span>
                <span className="text-gray-700">vs</span>
                <span className={`${r.winner === 'B' ? 'text-red-300 font-bold' : 'text-gray-500'}`}>{r.cardB?.name} ({r.valB})</span>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
