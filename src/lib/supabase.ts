import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) throw new Error('Missing PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) throw new Error('Missing PUBLIC_SUPABASE_ANON_KEY')

  return createClient(supabaseUrl, supabaseAnonKey)
}