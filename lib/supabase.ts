// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully with clear logging rather than throwing a hard unhandled crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ CRIT INFRASTRUCTURE WARNING: Supabase keys are completely missing from environment memory variables. Check your .env.local file configuration layout!"
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-to-prevent-crash.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);