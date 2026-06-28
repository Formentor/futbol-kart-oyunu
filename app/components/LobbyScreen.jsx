'use client';
import { useState } from 'react';

function sanitize(v) {
  return v.replace(/[^a-zA-Z0-9ÇçĞğİıÖöŞşÜü]/g, '').toUpperCase();
}

export default function LobbyScreen({ game, onBack }) {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) return;
    setLoading(true);
    await game.createGame(name);
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name || code.length < 4) return;
    setLoading(true);
    await game.joinGame(code, name);
    setLoading(false);
  };

  // Waiting for opponent after creating
  if (game.roomCode && game.phase === 'waiting-for-b') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <p className="text-5xl animate-pulse">⏳</p>
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-widest">Oda Oluşturuldu</h2>
        <p className="text-gray-400 text-sm">Bu kodu rakibinle paylaş:</p>
        <div className="bg-gray-800 border-2 border-yellow-500 rounded-2xl px-10 py-5 text-center">
          <p className="text-5xl font-black tracking-[0.3em] text-yellow-400">{game.roomCode}</p>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Rakip bekleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <p className="text-5xl mb-2">🌐</p>
        <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-widest">Online Oyun</h2>
      </div>

      {!mode ? (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => setMode('create')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-lg uppercase tracking-widest transition-all hover:scale-105"
          >
            Oyun Oluştur
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-black text-lg uppercase tracking-widest transition-all hover:scale-105"
          >
            Odaya Katıl
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-sm uppercase tracking-widest text-gray-400 transition-all"
          >
            ← Geri
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-yellow-400">İsmin</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(sanitize(e.target.value))}
              placeholder="ISMIN"
              maxLength={16}
              className="w-full bg-gray-800 border-2 border-yellow-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white font-bold outline-none uppercase tracking-widest"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-green-400">Oda Kodu</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0000"
                maxLength={4}
                className="w-full bg-gray-800 border-2 border-green-800 focus:border-green-400 rounded-xl px-4 py-3 text-white font-black outline-none uppercase tracking-[0.3em] text-center text-xl"
              />
            </div>
          )}

          {game.lobbyError && (
            <p className="text-red-400 text-sm font-bold text-center">{game.lobbyError}</p>
          )}

          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={loading || !name || (mode === 'join' && code.length < 4)}
            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all
              ${loading || !name || (mode === 'join' && code.length < 4)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105'}`}
          >
            {loading ? 'Yükleniyor...' : mode === 'create' ? 'Oluştur →' : 'Katıl →'}
          </button>

          <button
            onClick={() => { setMode(null); setName(''); setCode(''); }}
            className="text-gray-500 text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors"
          >
            ← Geri
          </button>
        </div>
      )}
    </div>
  );
}
