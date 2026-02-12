import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/**
 * Supabase client (anon role, respects RLS)
 * Used by Edge middleware for token validation
 * Uses NEXT_PUBLIC_ env vars available in Edge Runtime
 */
export function getSupabaseClient() {
  if (!anonClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    anonClient = createClient(url, anonKey);
  }
  return anonClient;
}

/**
 * Supabase admin client (service role, bypasses RLS)
 * For server components, server actions, and admin operations
 * MUST only be used server-side — never expose service key to client
 */
export function getSupabaseAdmin() {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    adminClient = createClient(url, serviceKey);
  }
  return adminClient;
}
