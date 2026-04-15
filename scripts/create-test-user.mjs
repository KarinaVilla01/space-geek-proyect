import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

const email = 'admin@test.com'
const password = 'Admin12345!'

const { data, error } = await supabase.auth.signUp({
  email,
  password,
})

console.log('error:', error)
console.log('data:', data)