import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_URL
    ? process.env.PUBLIC_SUPABASE_URL
    : import.meta.env.PUBLIC_SUPABASE_URL

const supabaseAnonKey =
  typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_ANON_KEY
    ? process.env.PUBLIC_SUPABASE_ANON_KEY
    : import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing PUBLIC_SUPABASE_URL')
if (!supabaseAnonKey) throw new Error('Missing PUBLIC_SUPABASE_ANON_KEY')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)