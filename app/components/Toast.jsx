'use client';
import { useEffect, useState } from 'react';

export default function Toast({ message, trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-gray-800 border border-yellow-500 text-yellow-300 font-bold text-sm px-5 py-3 rounded-2xl shadow-xl tracking-wide">
        {message}
      </div>
      <style>{`
        @keyframes bounceIn {
          0%   { transform: translateY(-20px); opacity: 0; }
          60%  { transform: translateY(4px);   opacity: 1; }
          100% { transform: translateY(0);     opacity: 1; }
        }
        .animate-bounce-in { animation: bounceIn 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}
