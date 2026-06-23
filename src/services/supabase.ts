import { createClient } from '@supabase/supabase-js';

// Use placeholders to prevent the app from crashing on startup if env variables are not configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file. Running in local mock mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
