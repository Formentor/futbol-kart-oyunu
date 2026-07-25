'use client';
import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useOnlineGame } from './hooks/useOnlineGame';
import NameScreen from './components/NameScreen';
import DraftScreen from './components/DraftScreen';
import PlayScreen from './components/PlayScreen';
import RevealScreen from './components/RevealScreen';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import LobbyScreen from './components/LobbyScreen';
import AuthButton from './components/AuthButton';
import NicknameModal from './components/NicknameModal';
import { createClient } from './lib/supabase/client';

function GuestModal({ onConfirm, onCancel }) {
  const [name, setName] = useState('');
  const sanitize = (v) => v.replace(/[^a-zA-Z0-9ÇçĞğİıÖöŞşÜü_]/g, '');
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5">
        <div className="text-center">
          <p className="text-4xl mb-3">👤</p>
          <h2 className="text-white text-xl font-black">Misafir girişi</h2>
          <p className="text-gray-400 text-sm mt-1">Oyunda görünecek ismi gir</p>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(sanitize(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && onConfirm(name.trim())}
          placeholder="İsmin"
          maxLength={16}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors uppercase tracking-widest"
          autoFocus
        />
        <button
          onClick={() => onConfirm(name.trim())}
          disabled={name.trim().length < 2}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black rounded-xl text-lg transition-all"
        >
          Devam Et →
        </button>
        <button onClick={onCancel} className="text-gray-500 text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors text-center">
          İptal
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameA, setNameA] = useState('Oyuncu A');
  const [nameB, setNameB] = useState('Oyuncu B');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameMode, setGameMode] = useState(null); // null | 'local' | 'online'
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState(null); // null = yükleniyor, '' = yok, 'x' = var
  const [guestName, setGuestName] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const supabase = createClient();

  // Kullanıcı değişince profili çek
  const handleUserChange = async (u) => {
    setUser(u);
    if (!u) { setNickname(null); return; }
    const { data } = await supabase.from('profiles').select('username').eq('id', u.id).single();
    setNickname(data?.username || '');
  };

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(data => { setPlayers(data.players); setLoading(false); })
      .catch(() => setError('Oyuncu verisi yüklenemedi.'));
  }, []);

  const localGame = useGameState(players);
  const onlineGame = useOnlineGame(players);
  const game = gameMode === 'online' ? onlineGame : localGame;

  useEffect(() => {
    if (players.length > 0 && localGame.phase === 'loading') {
      localGame.onPlayersLoaded();
    }
  }, [players, localGame.phase]);

  // Online: sync player names from game state
  useEffect(() => {
    if (gameMode === 'online' && onlineGame.role) {
      // names come from Supabase state via roundResult / scores panel
    }
  }, [gameMode, onlineGame.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4 animate-bounce">⚽</p>
          <p className="text-white text-xl font-black animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-xl font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-700 rounded-xl text-white font-bold">Yenile</button>
        </div>
      </div>
    );
  }

  const HomeButton = () => (
    <button
      onClick={() => { setGameMode(null); setShowLeaderboard(false); }}
      className="fixed top-3 left-3 z-50 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-xl text-sm font-bold transition-all border border-white/10"
    >
      ⚽ Ana Sayfa
    </button>
  );

  if (showLeaderboard) return <><HomeButton /><LeaderboardScreen onBack={() => setShowLeaderboard(false)} /></>;

  // Ana sayfa dışındaki tüm ekranlarda HomeButton sabit görünür
  const withHome = (el) => <>{(gameMode) && <HomeButton />}{el}</>;

  // ── Mode selection ───────────────────────────────────────────────────────────
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-8 p-6">
        {/* Üst köşe: auth */}
        <div className="absolute top-4 right-4">
          <AuthButton onUserChange={handleUserChange} nickname={nickname} />
        </div>

        {/* Nickname modal — login olmuş ama isim seçmemiş */}
        {user && nickname === '' && (
          <NicknameModal user={user} onSaved={(n) => setNickname(n)} />
        )}

        {/* Misafir isim modal */}
        {showGuestModal && (
          <GuestModal
            onConfirm={(name) => { setGuestName(name); setShowGuestModal(false); setGameMode('online'); }}
            onCancel={() => setShowGuestModal(false)}
          />
        )}

        <div className="text-center">
          <p className="text-6xl mb-3">⚽</p>
          <h1 className="text-4xl font-black tracking-widest uppercase text-yellow-400">Futbol Kart</h1>
          <p className="text-gray-400 text-sm mt-1 tracking-widest uppercase">Oyunu</p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => setGameMode('local')}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-black text-xl uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
          >
            🎮 Hot Seat (Aynı Cihaz)
          </button>
          <button
            onClick={() => (user || guestName) ? setGameMode('online') : setShowGuestModal(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xl uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
          >
            🌐 Online
          </button>
          {!user && (
            <button
              onClick={() => setShowGuestModal(true)}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl font-bold text-sm uppercase tracking-widest text-gray-300 transition-all"
            >
              👤 Misafir Olarak Devam Et
            </button>
          )}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-sm uppercase tracking-widest text-gray-400 transition-all"
          >
            🏅 Sıralama Tablosu
          </button>
        </div>
      </div>
    );
  }

  // ── Online lobby ─────────────────────────────────────────────────────────────
  if (gameMode === 'online') {
    const { phase, role } = onlineGame;

    if (!onlineGame.roomCode || phase === 'waiting-for-b') {
      return withHome(<LobbyScreen game={onlineGame} onBack={() => setGameMode(null)} nickname={nickname || guestName} />);
    }

    const oNameA = onlineGame.playerA || 'Oyuncu A';
    const oNameB = onlineGame.playerB || 'Oyuncu B';

    // Waiting overlay (draft confirmed, waiting for other player)
    const waiting = phase === 'draft-waiting' || phase === 'play-waiting';

    if (waiting) {
      return withHome(
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
          <p className="text-5xl animate-pulse">⏳</p>
          <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-widest">
            {phase === 'draft-waiting'
            ? `${onlineGame.role === 'A' ? oNameB : oNameA} seçimini yapıyor...`
            : `${onlineGame.role === 'A' ? oNameB : oNameA} kartını seçiyor...`}
          </h2>
          <p className="text-gray-500 text-sm">Oda: <span className="text-yellow-400 font-black tracking-widest">{onlineGame.roomCode}</span></p>
        </div>
      );
    }

    if (phase === 'draft-A' || phase === 'draft-B') return withHome(<DraftScreen game={onlineGame} nameA={oNameA} nameB={oNameB} isOnline />);
    if (phase === 'play-select-A' || phase === 'play-select-B') return withHome(<PlayScreen game={onlineGame} nameA={oNameA} nameB={oNameB} isOnline />);
    if (phase === 'reveal' || phase === 'reveal-final') return withHome(<RevealScreen game={onlineGame} nameA={oNameA} nameB={oNameB} />);
    if (phase === 'gameover') {
      return withHome(
        <GameOverScreen
          game={onlineGame}
          nameA={oNameA}
          nameB={oNameB}
          onLeaderboard={() => setShowLeaderboard(true)}
          role={onlineGame.role}
          isOnline
        />
      );
    }
    return null;
  }

  // ── Local (hot seat) flow ────────────────────────────────────────────────────
  const { phase } = localGame;

  if (phase === 'name') {
    return withHome(
      <NameScreen
        onStart={(a, b) => { setNameA(a); setNameB(b); localGame.startGame(); }}
        onLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }
  if (phase === 'draft-A' || phase === 'draft-B') return withHome(<DraftScreen game={localGame} nameA={nameA} nameB={nameB} />);
  if (phase === 'play-select-A' || phase === 'play-select-B') return withHome(<PlayScreen game={localGame} nameA={nameA} nameB={nameB} />);
  if (phase === 'reveal' || phase === 'reveal-final') return withHome(<RevealScreen game={localGame} nameA={nameA} nameB={nameB} />);
  if (phase === 'gameover') {
    return withHome(
      <GameOverScreen
        game={localGame}
        nameA={nameA}
        nameB={nameB}
        onLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }
  return null;
}
