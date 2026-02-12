import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Singleton client — agent is a long-running Express server
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get Supabase client with service role access (full CRUD on all tables)
 */
export function getSupabaseClient() {
  return supabase;
}
