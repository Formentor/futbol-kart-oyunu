'use client';
import { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';

const CARD_SIZES = {
  sm: { w: 112, h: 160 },
  md: { w: 144, h: 208 },
  lg: { w: 176, h: 256 },
};

const styles = `
@keyframes cardWin {
  0%   { transform: translateY(0)    scale(1);    filter: brightness(1); }
  35%  { transform: translateY(-18px) scale(1.09); filter: brightness(1.4) drop-shadow(0 0 14px #4ade80); }
  65%  { transform: translateY(-10px) scale(1.06); filter: brightness(1.25) drop-shadow(0 0 8px #4ade80); }
  100% { transform: translateY(0)    scale(1);    filter: brightness(1); }
}
@keyframes cardLose {
  0%,100% { transform: translateX(0); filter: grayscale(1) brightness(0.5); }
  20%      { transform: translateX(-7px); }
  40%      { transform: translateX(7px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
`;

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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    if (!flipped || (!winner && !loser)) return;
    // wait for flip transition (750ms) to finish before animating
    const t = setTimeout(() => setAnimate(true), 820);
    return () => clearTimeout(t);
  }, [flipped, winner, loser]);

  const accent =
    playerColor === 'blue'  ? { border: '#3b82f6', text: '#93c5fd', bg: 'rgba(30,58,138,0.5)',  label: 'A' } :
    playerColor === 'green' ? { border: '#22c55e', text: '#86efac', bg: 'rgba(20,83,45,0.5)',   label: 'A' } :
                              { border: '#ef4444', text: '#fca5a5', bg: 'rgba(127,29,29,0.5)', label: 'B' };

  const outerAnim = animate && winner
    ? { animation: 'cardWin 0.7s ease-out forwards' }
    : animate && loser
    ? { animation: 'cardLose 0.5s ease-out forwards', filter: 'grayscale(1) brightness(0.5)' }
    : {};

  return (
    <>
      <style>{styles}</style>
      {/* Outer wrapper handles win/lose animation — isolated from flip */}
      <div style={{ width: w, height: h, flexShrink: 0, overflow: 'visible', ...outerAnim }}>
        {/* Inner wrapper handles 3D flip */}
        <div style={{ perspective: '1000px', width: '100%', height: '100%' }}>
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
            {/* FRONT — face down (decorative back) */}
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
      </div>
    </>
  );
}
