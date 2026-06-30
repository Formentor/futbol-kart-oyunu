'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function NicknameModal({ user, onSaved }) {
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const save = async () => {
    const trimmed = nick.trim();
    if (trimmed.length < 2) return setError('En az 2 karakter olmalı.');
    if (trimmed.length > 20) return setError('En fazla 20 karakter olabilir.');
    if (!/^[a-zA-Z0-9_çÇğĞıİöÖşŞüÜ]+$/.test(trimmed)) return setError('Sadece harf, rakam ve _ kullanabilirsin.');

    setSaving(true);
    const { error: dbErr } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id);

    if (dbErr) {
      setError('Kaydedilemedi, tekrar dene.');
      setSaving(false);
    } else {
      onSaved(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5">
        <div className="text-center">
          <img
            src={user.user_metadata?.avatar_url}
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-yellow-400"
          />
          <h2 className="text-white text-xl font-black">Takma adını seç</h2>
          <p className="text-gray-400 text-sm mt-1">Oyunlarda bu isim görünecek</p>
        </div>

        <input
          type="text"
          value={nick}
          onChange={e => { setNick(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="örn. KralFutbol"
          maxLength={20}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
          autoFocus
        />

        {error && <p className="text-red-400 text-sm text-center -mt-2">{error}</p>}

        <button
          onClick={save}
          disabled={saving || nick.trim().length < 2}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-black rounded-xl text-lg transition-all"
        >
          {saving ? 'Kaydediliyor...' : 'Devam Et'}
        </button>
      </div>
    </div>
  );
}
