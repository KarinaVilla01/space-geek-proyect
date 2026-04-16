import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) throw new Error('Missing PUBLIC_SUPABASE_URL')
if (!supabaseSecretKey) throw new Error('Missing SUPABASE_SECRET_KEY')

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const email = 'admin@test.com'
const password = 'Admin12345!'

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (createError) {
  console.error('createUser error:', createError)
  process.exit(1)
}

const user = created.user

const { error: adminInsertError } = await supabase
  .from('admin_users')
  .upsert(
    {
      id: user.id,
      email,
      role: 'admin',
      is_active: true,
    },
    { onConflict: 'id' }
  )

if (adminInsertError) {
  console.error('admin_users upsert error:', adminInsertError)
  process.exit(1)
}

console.log('Admin bootstrap OK')
console.log({
  id: user.id,
  email: user.email,
})