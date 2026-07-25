import { NextResponse } from 'next/server';

// Redirect to client-side page to handle code exchange in the browser
export async function GET(request) {
  const url = new URL(request.url);
  const params = url.searchParams.toString();
  return NextResponse.redirect(`${url.origin}/auth/finish${params ? '?' + params : ''}`);
}
