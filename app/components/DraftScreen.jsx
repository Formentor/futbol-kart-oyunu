'use client';
import PlayerCard from './PlayerCard';

export default function DraftScreen({ game, nameA, nameB }) {
  const { phase, poolA, poolB, draftSelA, draftSelB,
    toggleDraftA, toggleDraftB, confirmDraftA, confirmDraftB, HAND_SIZE } = game;

  const isA = phase === 'draft-A';
  const pool = isA ? poolA : poolB;
  const selected = isA ? draftSelA : draftSelB;
  const toggle = isA ? toggleDraftA : toggleDraftB;
  const confirm = isA ? confirmDraftA : confirmDraftB;
  const playerLabel = isA ? nameA : nameB;
  const accent = isA
    ? { text: 'text-blue-400', border: 'border-blue-800', bg: 'bg-blue-950/40', btn: 'bg-blue-600 hover:bg-blue-500' }
    : { text: 'text-red-400', border: 'border-red-800', bg: 'bg-red-950/40', btn: 'bg-red-600 hover:bg-red-500' };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase">Futbol Kart Oyunu</h1>
          <p className="text-sm text-gray-400">Kadro Seçimi</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${accent.text}`}>{playerLabel}</p>
          <p className="text-sm text-gray-400">{selected.length}/{HAND_SIZE} kart</p>
        </div>
      </div>

      {/* Instruction */}
      <div className={`mx-4 mt-4 px-4 py-3 rounded-xl border ${accent.bg} ${accent.border}`}>
        <p className={`font-semibold ${accent.text}`}>
          {playerLabel}, {pool.length} kartınızdan {HAND_SIZE} tanesini seçin.
          {!isA && ' Oyuncu A ekrandan uzaklaşsın!'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Rakibinizin farklı kartları var — seçimleriniz el fazına kadar gizlidir.
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {pool.map(p => {
            const idx = selected.indexOf(p.id);
            return (
              <PlayerCard
                key={p.id}
                player={p}
                selected={idx !== -1}
                selectionNumber={idx !== -1 ? idx + 1 : null}
                onClick={() => toggle(p.id)}
                size="md"
              />
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="px-4 py-4 bg-gray-900 border-t border-gray-700">
        <button
          onClick={confirm}
          disabled={selected.length !== HAND_SIZE}
          className={`w-full py-3 rounded-xl font-black text-lg uppercase tracking-widest transition-all
            ${selected.length === HAND_SIZE
              ? `${accent.btn} text-white shadow-lg`
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {selected.length === HAND_SIZE
            ? 'Kadroyu Onayla →'
            : `${HAND_SIZE - selected.length} kart daha seçin`}
        </button>
      </div>
    </div>
  );
}
