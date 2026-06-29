'use client';

const BASE_RARITY = {
  'gold-special': { textDark: 'text-gray-950', textLight: 'text-white', footBg: 'bg-black/15' },
  gold:           { textDark: 'text-gray-950', textLight: 'text-white', footBg: 'bg-black/15' },
};

// One consistent gradient per position group — rarity only affects the border glow
const POS_STYLES = {
  GK:  { bg: 'from-lime-300 via-green-300 to-emerald-500',   nameBg: 'bg-gradient-to-r from-emerald-800/80 to-green-700/80' },
  DEF: { bg: 'from-cyan-300 via-teal-300 to-cyan-500',       nameBg: 'bg-gradient-to-r from-teal-800/80 to-cyan-700/80' },
  MID: { bg: 'from-violet-300 via-blue-300 to-indigo-500',   nameBg: 'bg-gradient-to-r from-indigo-800/80 to-blue-700/80' },
  FWD: { bg: 'from-rose-300 via-red-300 to-rose-500',        nameBg: 'bg-gradient-to-r from-rose-800/80 to-red-700/80' },
};

const RARITY_BORDER = {
  'gold-special': { border: 'border-yellow-300', shine: 'shadow-yellow-300/60' },
  gold:           { border: 'border-white/30',   shine: 'shadow-black/30' },
};

const DEF_POSITIONS = new Set(['CB','LB','RB','LWB','RWB']);
const MID_POSITIONS = new Set(['CM','CDM','CAM','AM']);

function getPosGroup(position) {
  const p = (position || '').toUpperCase();
  if (p === 'GK') return 'GK';
  if (DEF_POSITIONS.has(p)) return 'DEF';
  if (MID_POSITIONS.has(p)) return 'MID';
  return 'FWD';
}

function getCardStyle(player) {
  const base = BASE_RARITY[player.rarity] || BASE_RARITY.gold;
  const posStyle = POS_STYLES[getPosGroup(player.position)];
  const rarityBorder = RARITY_BORDER[player.rarity] || RARITY_BORDER.gold;
  return { ...base, ...posStyle, ...rarityBorder };
}

function Silhouette() {
  return (
    <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="22" rx="15" ry="17" fill="rgba(0,0,0,0.18)" />
      <rect x="44" y="37" width="12" height="8" rx="4" fill="rgba(0,0,0,0.16)" />
      <path d="M24 62 Q28 46 50 44 Q72 46 76 62 L74 98 Q62 101 50 101 Q38 101 26 98 Z" fill="rgba(0,0,0,0.18)" />
      <path d="M24 62 Q13 68 10 86 Q17 90 25 86 Q26 72 32 66" fill="rgba(0,0,0,0.16)" />
      <path d="M76 62 Q87 68 90 86 Q83 90 75 86 Q74 72 68 66" fill="rgba(0,0,0,0.16)" />
      <path d="M32 97 Q28 112 27 124 Q35 126 39 124 Q40 110 44 98" fill="rgba(0,0,0,0.18)" />
      <path d="M68 97 Q72 112 73 124 Q65 126 61 124 Q60 110 56 98" fill="rgba(0,0,0,0.18)" />
    </svg>
  );
}

function PlayerImage({ player }) {
  if (!player) return null;
  const src = player.image || `/player-images/${player.id}.jpg`;
  return (
    <img
      src={src}
      alt={player.name}
      className="w-full h-full object-cover object-top drop-shadow-lg"
      onError={e => {
        e.target.style.display = 'none';
        const fb = e.target.parentNode.querySelector('.sil-fb');
        if (fb) fb.style.display = 'flex';
      }}
    />
  );
}

export default function PlayerCard({
  player,
  selected = false,
  selectionNumber = null, // 1-5 draft order badge
  onClick,
  size = 'md',
  winner = false,
  loser = false,
  dimmed = false,
}) {
  const r = getCardStyle(player);

  const dim = {
    xs: { card: 'w-14 h-20', rating: 'text-base', pos: 'text-[7px]', name: 'text-[7px]', sub: 'text-[6px]' },
    sm: { card: 'w-28 h-40', rating: 'text-2xl', pos: 'text-[9px]', name: 'text-[9px]', sub: 'text-[8px]' },
    md: { card: 'w-36 h-52', rating: 'text-3xl', pos: 'text-[10px]', name: 'text-[11px]', sub: 'text-[9px]' },
    lg: { card: 'w-44 h-64', rating: 'text-4xl', pos: 'text-xs', name: 'text-xs', sub: 'text-[10px]' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`
        relative ${dim.card} rounded-2xl bg-gradient-to-b ${r.bg}
        border-2 transition-all duration-200 select-none
        ${selected ? 'border-white ring-2 ring-white scale-105 shadow-2xl shadow-white/30' : ''}
        ${winner ? 'border-green-300 ring-2 ring-green-400 scale-105 shadow-2xl shadow-green-400/40' : ''}
        ${!selected && !winner ? r.border : ''}
        ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-default'}
        ${(loser || dimmed) && !winner ? 'opacity-40 grayscale' : ''}
        shadow-lg ${r.shine} flex flex-col overflow-hidden
      `}
    >
      {/* Top row: flag + position (left) */}
      <div className="flex items-center gap-1 px-2 pt-1.5 shrink-0">
        <span className={`${size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-base' : 'text-xl'} leading-none`}>{player.flag_emoji}</span>
        <span className={`font-bold uppercase tracking-wider ${dim.pos} ${r.textDark} opacity-70`}>{player.position}</span>
      </div>

      {/* Player image — fills remaining space */}
      <div className="flex-1 flex items-end justify-center px-1 pb-1 min-h-0 overflow-hidden">
        <PlayerImage player={player} />
        <div className="sil-fb w-full h-full items-end justify-center" style={{ display: 'none' }}>
          <Silhouette />
        </div>
      </div>

      {/* Name bar */}
      <div className={`${r.nameBg} px-2 py-0.5`}>
        <p className={`font-black uppercase tracking-widest text-center truncate ${dim.name} ${r.textLight}`}>
          {player.name}
        </p>
      </div>

      {/* Club + Age */}
      <div className={`${r.footBg} px-2 py-1 flex items-center justify-between`}>
        <span className={`font-semibold truncate ${dim.sub} ${r.textDark} opacity-80 max-w-[70%]`}>
          {player.current_club}
        </span>
        <span className={`font-bold shrink-0 ${dim.sub} ${r.textDark} opacity-70`}>
          {player.age} yaş
        </span>
      </div>

      {/* Selection number badge */}
      {selectionNumber && (
        <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10 border-2 border-green-400">
          <span className="text-green-700 text-xs font-black leading-none">{selectionNumber}</span>
        </div>
      )}

      {/* Winner star */}
      {winner && (
        <div className="absolute top-1.5 right-1.5 text-lg z-10 drop-shadow">⭐</div>
      )}
    </div>
  );
}
