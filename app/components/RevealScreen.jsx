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
    <div className="flex gap-2 overflow-x-auto pb-1 justify-center flex-wrap">
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

  useEffect(() => {
    setFlipped(false);
    setShowValues(false);
    setShowResult(false);
    setNextTimer(null);
    clearInterval(nextIntervalRef.current);
    if (!roundResult) return;
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
  }, [roundResult]);

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

  const winnerLabel = isDraw ? 'Beraberlik!' : winner === 'A' ? `${nameA} Kazandı!` : `${nameB} Kazandı!`;
  const bannerColor = isDraw ? 'bg-yellow-950/40 border-yellow-700 text-yellow-400'
    : winner === 'A' ? 'bg-blue-950/40 border-blue-700 text-blue-400'
    : 'bg-red-950/40 border-red-700 text-red-400';

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

      {/* Player A hand */}
      <div className="w-full max-w-2xl">
        <p className={`text-xs font-black uppercase tracking-wider mb-2 text-center ${showResult && winner === 'A' ? 'text-blue-400' : 'text-gray-500'}`}>
          {nameA} {showResult && winner === 'A' ? '⭐' : ''}
        </p>
        <HandRow
          hand={handA}
          usedSet={usedA}
          cardOutcomes={cardOutcomes}
          selectedId={cardA.id}
          flipped={flipped}
          playerColor="blue"
          winner={showResult ? winner : null}
          question={question}
        />
        {/* Value under selected card */}
        <div className="flex justify-center mt-1">
          <div className={`transition-all duration-500 px-3 py-1 rounded-lg text-center border min-w-[100px]
            ${showValues
              ? winner === 'A' ? 'opacity-100 bg-blue-900/50 border-blue-600' : 'opacity-100 bg-gray-800 border-gray-700'
              : 'opacity-0'}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{question.unit}</p>
            <p className={`text-lg font-black ${winner === 'A' ? 'text-blue-300' : 'text-gray-400'}`}>
              {formatVal(valA, question)}
            </p>
          </div>
        </div>
      </div>

      <div className={`text-gray-700 font-black text-lg transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0'}`}>— VS —</div>

      {/* Player B hand */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-1">
          <div className={`transition-all duration-500 px-3 py-1 rounded-lg text-center border min-w-[100px]
            ${showValues
              ? winner === 'B' ? 'opacity-100 bg-red-900/50 border-red-600' : 'opacity-100 bg-gray-800 border-gray-700'
              : 'opacity-0'}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{question.unit}</p>
            <p className={`text-lg font-black ${winner === 'B' ? 'text-red-300' : 'text-gray-400'}`}>
              {formatVal(valB, question)}
            </p>
          </div>
        </div>
        <HandRow
          hand={handB}
          usedSet={usedB}
          cardOutcomes={cardOutcomes}
          selectedId={cardB.id}
          flipped={flipped}
          playerColor="red"
          winner={showResult ? winner : null}
          question={question}
        />
        <p className={`text-xs font-black uppercase tracking-wider mt-2 text-center ${showResult && winner === 'B' ? 'text-red-400' : 'text-gray-500'}`}>
          {nameB} {showResult && winner === 'B' ? '⭐' : ''}
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
          <p className="text-blue-400 text-xs font-bold truncate max-w-[70px]">{nameA}</p>
          <p className="text-3xl font-black text-blue-300">{scoreA}</p>
        </div>
        <p className="text-gray-600 text-xs">/ {WIN_SCORE}</p>
        <div className="text-center">
          <p className="text-red-400 text-xs font-bold truncate max-w-[70px]">{nameB}</p>
          <p className="text-3xl font-black text-red-300">{scoreB}</p>
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
