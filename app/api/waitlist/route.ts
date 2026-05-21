// app/api/waitlist/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 1. GET ROUTE: High-performance internal RPC system counting loop
export async function GET() {
  try {
    // .rpc() invokes our security definer database module cleanly
    const { data: count, error } = await supabase.rpc('get_waitlist_count');

    if (error) {
      console.error("Supabase RPC Execution Fault:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}