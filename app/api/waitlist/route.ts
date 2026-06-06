// app/api/waitlist/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 2. POST ROUTE: (Keep your exact signup logic here intact)
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email.toLowerCase().trim() }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'You are already on the list! Welcome back.' }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/waitlist error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Use the safe count-only RPC created in Supabase.
    // This avoids row-level security issues and returns just the total count.
    const { data, error } = await supabase.rpc('waitlist_total');

    if (error) {
      console.error('Supabase Count Fault:', error);
      return NextResponse.json({ error: 'Database fault' }, { status: 500 });
    }

    const count = typeof data === 'number' ? data : Number(data ?? 0);
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}