'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

function AuthFinishInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) { router.replace('/'); return; }
    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code)
      .finally(() => router.replace('/'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl animate-pulse">⚽ Giriş yapılıyor...</p>
    </div>
  );
}

export default function AuthFinish() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">⚽ Giriş yapılıyor...</p>
      </div>
    }>
      <AuthFinishInner />
    </Suspense>
  );
}
