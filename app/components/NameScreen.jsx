'use client';
import { useState } from 'react';

function sanitize(val) {
  return val.replace(/[^a-zA-Z0-9ÇçĞğİıÖöŞşÜü]/g, '').toUpperCase();
}

export default function NameScreen({ onStart, onLeaderboard }) {
  const [nameA, setNameA] = useState('');
  const [nameB, setNameB] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const a = nameA.trim() || 'OYUNCUA';
    const b = nameB.trim() || 'OYUNCUB';
    if (a === b) {
      setError('İki oyuncu aynı ismi kullanamaz!');
      return;
    }
    setError('');
    onStart(a, b);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-8 p-6">
      {/* Logo */}
      <div className="text-center">
        <p className="text-6xl mb-3">⚽</p>
        <h1 className="text-4xl font-black tracking-widest uppercase text-yellow-400">
          Futbol Kart
        </h1>
        <p className="text-gray-400 text-sm mt-1 tracking-widest uppercase">Oyunu</p>
      </div>

      {/* Name inputs */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="block text-blue-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            Oyuncu A
          </label>
          <input
            type="text"
            value={nameA}
            onChange={e => { setNameA(sanitize(e.target.value)); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="ISMINIZI GIRIN"
            maxLength={16}
            className="w-full bg-gray-800 border-2 border-blue-800 focus:border-blue-400 rounded-xl px-4 py-3 text-white font-bold outline-none placeholder-gray-600 transition-colors uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-red-400 text-xs font-bold uppercase tracking-widest mb-1.5">
            Oyuncu B
          </label>
          <input
            type="text"
            value={nameB}
            onChange={e => { setNameB(sanitize(e.target.value)); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="ISMINIZI GIRIN"
            maxLength={16}
            className="w-full bg-gray-800 border-2 border-red-800 focus:border-red-400 rounded-xl px-4 py-3 text-white font-bold outline-none placeholder-gray-600 transition-colors uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm font-bold text-center -mt-4">{error}</p>
      )}

      {/* Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={handleStart}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-black text-xl uppercase tracking-widest transition-all shadow-lg hover:scale-105"
        >
          Oyuna Başla →
        </button>
        <button
          onClick={onLeaderboard}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-sm uppercase tracking-widest transition-all border border-gray-700"
        >
          🏅 Sıralama Tablosu
        </button>
      </div>

      {/* Rules summary */}
      <div className="w-full max-w-sm bg-gray-900 rounded-xl border border-gray-700 p-4 text-xs text-gray-400 leading-relaxed">
        <p className="text-gray-300 font-bold mb-2 text-sm">Nasıl Oynanır?</p>
        <p>• Her oyuncu farklı 10 karttan 5 tanesini seçer</p>
        <p>• Soru gelir — her oyuncu 1 kart seçer</p>
        <p>• Soruya en uygun değer kazanır</p>
        <p>• <span className="text-yellow-400 font-bold">İlk 3 eli kazanan oyunu kazanır</span></p>
      </div>
    </div>
  );
}
