import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/^["'](.+)["']$/, '$1');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^["'](.+)["']$/, '$1');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
