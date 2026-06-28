'use client';
import PlayerCard from './PlayerCard';

const CARD_SIZES = {
  sm: { w: 112, h: 160 },
  md: { w: 144, h: 208 },
  lg: { w: 176, h: 256 },
};

export default function FlipCard({
  player,
  cardNumber,
  flipped = false,
  size = 'lg',
  winner = false,
  loser = false,
  playerColor = 'blue',
}) {
  const { w, h } = CARD_SIZES[size];

  const accent =
    playerColor === 'blue'
      ? { border: '#3b82f6', text: '#93c5fd', bg: 'rgba(30,58,138,0.5)', label: 'A' }
      : { border: '#ef4444', text: '#fca5a5', bg: 'rgba(127,29,29,0.5)', label: 'B' };

  return (
    <div style={{ perspective: '1000px', width: w, height: h, flexShrink: 0 }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT — face down */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: 16,
            background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 60%, #1e293b 100%)',
            border: `2px solid ${accent.border}60`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
            overflow: 'hidden',
          }}
        >
          {/* Concentric ring pattern */}
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${i * 22}%`, height: `${i * 22}%`,
                borderRadius: '50%',
                border: `1px solid ${accent.border}25`,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          ))}

          <span style={{ fontSize: 40, fontWeight: 900, color: `${accent.border}88`, position: 'relative' }}>?</span>

          {/* Number badge */}
          <div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: accent.bg,
              border: `2px solid ${accent.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              boxShadow: `0 0 12px ${accent.border}60`,
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 22, color: accent.text }}>{cardNumber}</span>
          </div>

          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, color: `${accent.border}88`, textTransform: 'uppercase' }}>
            Oyuncu {accent.label}
          </span>
        </div>

        {/* BACK — actual player card */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <PlayerCard player={player} size={size} winner={winner} loser={loser} />
        </div>
      </div>
    </div>
  );
}
