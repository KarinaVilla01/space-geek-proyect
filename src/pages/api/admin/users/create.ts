import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../../lib/supabase'
import { supabaseAdmin } from '../../../../lib/supabase/server'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseClient()

  const accessToken = cookies.get('sb-access-token')
  const refreshToken = cookies.get('sb-refresh-token')

  if (!accessToken || !refreshToken) {
    return redirect('/admin/loginOscarUnique')
  }

  const sessionResult = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (sessionResult.error || !sessionResult.data.user) {
    cookies.delete('sb-access-token', { path: '/' })
    cookies.delete('sb-refresh-token', { path: '/' })
    return redirect('/admin/loginOscarUnique')
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', sessionResult.data.user.id)
    .maybeSingle()

  if (!adminUser || adminUser.role !== 'admin' || adminUser.is_active !== true) {
    return redirect('/admin/loginOscarUnique?error=Not%20authorized')
  }

  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const displayName = String(formData.get('display_name') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const role = String(formData.get('role') ?? 'editor').trim()

  if (!email || !password || !displayName) {
    return redirect('/admin/users?error=Todos%20los%20campos%20son%20requeridos')
  }

  if (password.length < 8) {
    return redirect('/admin/users?error=La%20contrase%C3%B1a%20debe%20tener%20al%20menos%208%20caracteres')
  }

  if (!['admin', 'editor'].includes(role)) {
    return redirect('/admin/users?error=Rol%20no%20v%C3%A1lido')
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    const msg = authError?.message ?? 'Error al crear el usuario'
    return redirect(`/admin/users?error=${encodeURIComponent(msg)}`)
  }

  const { error: dbError } = await supabaseAdmin
    .from('admin_users')
    .insert({
      id: authData.user.id,
      email,
      display_name: displayName,
      role,
      is_active: true,
    })

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return redirect(`/admin/users?error=${encodeURIComponent(dbError.message)}`)
  }

  return redirect(`/admin/users?success=${encodeURIComponent(`Usuario ${email} creado correctamente`)}`)
}
