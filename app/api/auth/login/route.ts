import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json({ message: 'Internal error connecting to backend.' }, { status: 500 });
  }
}
