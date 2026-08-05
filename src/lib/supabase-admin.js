import { createClient } from '@supabase/supabase-js';

let client;

/**
 * Server-side Supabase client using the service role key. Only ever
 * imported from Netlify Functions — never bundled into the dashboard.
 * Both env vars are read at call time (not module load) so functions
 * fail with a clear error instead of a cryptic bundler crash when
 * secrets haven't been configured yet.
 */
export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
