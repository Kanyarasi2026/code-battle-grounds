import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'];

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      'Warning: Supabase credentials not configured. Authentication will not work.',
    );
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
};

export const supabase = getSupabase();
