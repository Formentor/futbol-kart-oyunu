import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/*
  Şu an statik JSON dosyasından okur.
  İleride API-Football entegrasyonu için buraya ekle:
    const res = await fetch('https://v3.football.api-sports.io/players?...', {
      headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY }
    });
  ve dönen veriyi aşağıdaki şemaya map'le.
*/
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'players.json');
    const raw = readFileSync(filePath, 'utf-8');
    const players = JSON.parse(raw);
    return NextResponse.json({ players, source: 'static' });
  } catch (err) {
    return NextResponse.json({ error: 'Oyuncu verisi yüklenemedi' }, { status: 500 });
  }
}
