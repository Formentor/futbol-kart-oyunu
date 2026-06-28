'use client';
import { useEffect, useState, useRef } from 'react';
import FlipCard from './FlipCard';
import PlayerCard from './PlayerCard';

const NEXT_TIMER = 10;

const formatVal = (v, q) => {
  if (!q) return v;
  if (q.field === 'birthplace_population') return Number(v).toLocaleString('tr-TR');
  if (q.field === 'highest_transfer_fee_m' || q.field === 'peak_market_value_m' || q.field === 'weekly_wage_k') return `${v}${q.unit}`;
  if (q.field === 'instagram_m') return `${v}M`;
  return `${v} ${q.unit}`;
};

function HandRow({ hand, usedSet, cardOutcomes, selectedId, flipped, playerColor, winner, question }) {
  return (
    <div className="flex gap-2 pb-1 justify-center flex-wrap overflow-visible">
      {hand.map(card => {
        const isSelected = card.id === selectedId;
        const isPrevUsed = usedSet.has(card.id) && !isSelected;

        if (isSelected) {
          return (
            <FlipCard
              key={card.id}
              player={card}
              cardNumber={card.selectionNumber}
              flipped={flipped}
              size="sm"
              playerColor={playerColor}
              winner={winner === (playerColor === 'blue' ? 'A' : 'B')}
              loser={winner !== (playerColor === 'blue' ? 'A' : 'B') && winner !== 'draw'}
            />
          );
        }

        if (isPrevUsed) {
          const outcome = cardOutcomes[card.id]; // 'win' | 'draw' | 'loss'
          const won = outcome === 'win' || outcome === 'draw';
          return (
            <div key={card.id} className="relative shrink-0">
              <PlayerCard player={card} size="sm" dimmed={!won} winner={won} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={`text-2xl ${won ? 'opacity-70' : 'opacity-40 text-white'}`}>
                  {won ? '✓' : '✗'}
                </span>
              </div>
            </div>
          );
        }

        // Unused card — face-down with selection number
        return (
          <FlipCard
            key={card.id}
            player={card}
            cardNumber={card.selectionNumber}
            flipped={false}
            size="sm"
            playerColor={playerColor}
          />
        );
      })}
    </div>
  );
}

export default function RevealScreen({ game, nameA, nameB }) {
  const { roundResult, roundHistory, handA, handB, usedA, usedB, scoreA, scoreB, WIN_SCORE,
    nextRound, goToGameOver, phase,
    readyNext, myReady, oppReady, isOnline, role,
  } = game;
  const myName = isOnline ? (role === 'A' ? nameA : nameB) : null;
  const oppName = isOnline ? (role === 'A' ? nameB : nameA) : null;

  const [flipped, setFlipped] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [nextTimer, setNextTimer] = useState(null);
  const nextIntervalRef = useRef(null);
  const isFinal = phase === 'reveal-final';

  // Stable key so animations only re-trigger when the actual round changes,
  // not when object references change due to realtime polling events.
  const resultKey = roundResult
    ? `${roundResult.cardA?.id}-${roundResult.cardB?.id}-${roundResult.winner}`
    : null;

  useEffect(() => {
    // resultKey becomes null when round_result is cleared (transitioning to next round).
    // In that case the component already returns null — no need to reset flip state,
    // which would cause a visible flip-back animation just before unmounting.
    if (!resultKey) return;
    setFlipped(false);
    setShowValues(false);
    setShowResult(false);
    setNextTimer(null);
    clearInterval(nextIntervalRef.current);
    const t1 = setTimeout(() => setFlipped(true), 900);
    const t2 = setTimeout(() => setShowValues(true), 1750);
    const t3 = setTimeout(() => {
      setShowResult(true);
      if (!isFinal) {
        setNextTimer(NEXT_TIMER);
        nextIntervalRef.current = setInterval(() => {
          setNextTimer(prev => {
            if (prev <= 1) {
              clearInterval(nextIntervalRef.current);
              // auto-advance: for online, mark ready; for local, go next
              if (isOnline) readyNext?.();
              else nextRound();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(nextIntervalRef.current); };
  }, [resultKey]);

  const handleNext = () => {
    clearInterval(nextIntervalRef.current);
    if (isOnline) readyNext?.();
    else { isFinal ? goToGameOver() : nextRound(); }
  };

  if (!roundResult) return null;

  const { winner, cardA, cardB, question, valA, valB, isSuddenDeath } = roundResult;

  // Build outcome map from previous rounds (excludes current round)
  const cardOutcomes = {};
  roundHistory.slice(0, -1).forEach(r => {
    if (r.cardA) cardOutcomes[r.cardA.id] = r.winner === 'A' ? 'win' : r.winner === 'draw' ? 'draw' : 'loss';
    if (r.cardB) cardOutcomes[r.cardB.id] = r.winner === 'B' ? 'win' : r.winner === 'draw' ? 'draw' : 'loss';
  });
  const isDraw = winner === 'draw';

  // Online: viewer's own side on top (green), opponent on bottom (red).
  // Local (hot-seat): A on top, B on bottom.
  const viewerIsB = isOnline && role === 'B';
  const top    = viewerIsB ? { name: nameB, hand: handB, used: usedB, card: cardB, val: valB, side: 'B', color: 'green' } :
                              { name: nameA, hand: handA, used: usedA, card: cardA, val: valA, side: 'A', color: 'green' };
  const bottom = viewerIsB ? { name: nameA, hand: handA, used: usedA, card: cardA, val: valA, side: 'A', color: 'red' } :
                              { name: nameB, hand: handB, used: usedB, card: cardB, val: valB, side: 'B', color: 'red' };

  const nameColor = (side, pos) => {
    const isWinner = showResult && winner === side;
    if (pos === 'top')    return isWinner ? 'text-green-400' : 'text-gray-500';
    if (pos === 'bottom') return isWinner ? 'text-red-400'   : 'text-gray-500';
    return 'text-gray-500';
  };
  const valBg = (side) => showValues
    ? winner === side ? (side === top.side ? 'opacity-100 bg-green-900/50 border-green-700' : 'opacity-100 bg-red-900/50 border-red-700') : 'opacity-100 bg-gray-800 border-gray-700'
    : 'opacity-0';
  const valText = (side) => winner === side ? (side === top.side ? 'text-green-300' : 'text-red-300') : 'text-gray-400';

  const winnerLabel = isDraw ? 'Beraberlik!' : winner === top.side ? `${top.name} Kazandı!` : `${bottom.name} Kazandı!`;
  const bannerColor = isDraw ? 'bg-yellow-950/40 border-yellow-700 text-yellow-400'
    : winner === top.side ? 'bg-green-950/40 border-green-700 text-green-400'
    : 'bg-red-950/40 border-red-700 text-red-400';

  const myScore    = viewerIsB ? scoreB : scoreA;
  const oppScore   = viewerIsB ? scoreA : scoreB;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-3 p-4 pt-5">
      {isSuddenDeath && (
        <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">⚡ Ani Ölüm Turu</p>
      )}

      {/* Question */}
      <div className="w-full max-w-2xl bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-0.5">Soru</p>
        <p className="text-white font-bold text-sm">{question.text}</p>
        <p className="text-gray-500 text-xs">{question.higher_wins ? '↑ Yüksek değer kazanır' : '↓ Düşük değer kazanır'}</p>
      </div>

      {!flipped && <p className="text-gray-600 text-xs animate-pulse tracking-widest uppercase">Kartlar açılıyor...</p>}

      {/* Top player (me in online, A in local) */}
      <div className="w-full max-w-2xl overflow-visible">
        <p className={`text-xs font-black uppercase tracking-wider mb-2 text-center ${nameColor(top.side, 'top')}`}>
          {top.name} {showResult && winner === top.side ? '⭐' : ''}
        </p>
        <HandRow
          hand={top.hand}
          usedSet={top.used}
          cardOutcomes={cardOutcomes}
          selectedId={top.card.id}
          flipped={flipped}
          playerColor={top.color}
          winner={showResult ? winner : null}
          question={question}
        />
        <div className="flex justify-center mt-1">
          <div className={`transition-all duration-500 px-3 py-1 rounded-lg text-center border min-w-[100px] ${valBg(top.side)}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{question.unit}</p>
            <p className={`text-lg font-black ${valText(top.side)}`}>{formatVal(top.val, question)}</p>
          </div>
        </div>
      </div>

      <div className={`text-gray-700 font-black text-lg transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0'}`}>— VS —</div>

      {/* Bottom player (opponent in online, B in local) */}
      <div className="w-full max-w-2xl overflow-visible">
        <div className="flex justify-center mb-1">
          <div className={`transition-all duration-500 px-3 py-1 rounded-lg text-center border min-w-[100px] ${valBg(bottom.side)}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{question.unit}</p>
            <p className={`text-lg font-black ${valText(bottom.side)}`}>{formatVal(bottom.val, question)}</p>
          </div>
        </div>
        <HandRow
          hand={bottom.hand}
          usedSet={bottom.used}
          cardOutcomes={cardOutcomes}
          selectedId={bottom.card.id}
          flipped={flipped}
          playerColor={bottom.color}
          winner={showResult ? winner : null}
          question={question}
        />
        <p className={`text-xs font-black uppercase tracking-wider mt-2 text-center ${nameColor(bottom.side, 'bottom')}`}>
          {bottom.name} {showResult && winner === bottom.side ? '⭐' : ''}
        </p>
      </div>

      {/* Result banner */}
      <div className={`w-full max-w-2xl px-4 py-2 rounded-xl border text-center transition-all duration-500
        ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${bannerColor}`}>
        <p className="text-xl font-black">{winnerLabel}</p>
        {isDraw && <p className="text-yellow-300 text-xs">Yeni soru geliyor...</p>}
      </div>

      {/* Score */}
      <div className={`flex items-center gap-6 bg-gray-900 px-6 py-2 rounded-2xl border border-gray-700 transition-opacity duration-500 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <p className="text-green-400 text-xs font-bold truncate max-w-[70px]">{top.name}</p>
          <p className="text-3xl font-black text-green-300">{myScore}</p>
        </div>
        <p className="text-gray-600 text-xs">/ {WIN_SCORE}</p>
        <div className="text-center">
          <p className="text-red-400 text-xs font-bold truncate max-w-[70px]">{bottom.name}</p>
          <p className="text-3xl font-black text-red-300">{oppScore}</p>
        </div>
      </div>

      {/* Next button */}
      {isFinal ? (
        <button
          onClick={goToGameOver}
          disabled={!showValues}
          className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg
            ${showValues ? 'bg-green-600 hover:bg-green-500 hover:scale-105 cursor-pointer' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
        >
          Sonucu Gör →
        </button>
      ) : showResult && (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          {isOnline && myReady ? (
            <div className="w-full py-3 rounded-xl bg-gray-800 border border-green-700 text-green-400 font-black text-sm uppercase tracking-widest text-center">
              ✓ Hazır! {oppReady ? `— ${oppName} de hazır!` : `— ${oppName} bekleniyor...`}
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg bg-green-600 hover:bg-green-500 hover:scale-105 cursor-pointer"
            >
              {isDraw ? 'Beraberlik Turu →' : 'Sonraki Soru →'}
              {nextTimer !== null && ` (${nextTimer}s)`}
            </button>
          )}
          {isOnline && (
            <p className="text-gray-600 text-xs">
              {myReady && !oppReady ? `${oppName} hazır olunca geçilecek` : !myReady && nextTimer !== null ? `${nextTimer}s sonra otomatik geçilecek` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
