import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing PUBLIC_SUPABASE_URL');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, key, { auth: { persistSession: false } });
}

export const supabaseAdmin = getAdminClient();

export function createSupabaseServerClient(request: Request, _cookies: unknown) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing PUBLIC_SUPABASE_URL');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: request.headers.get('Authorization') || '' } },
  });
}
