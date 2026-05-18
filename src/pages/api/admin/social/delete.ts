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

  const user = sessionResult.data.user

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminUser || adminUser.role !== 'admin' || adminUser.is_active !== true) {
    return redirect('/admin/loginOscarUnique?error=Not%20authorized')
  }

  const formData = await request.formData()
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    return redirect('/admin/social?error=ID+no+válido')
  }

  const { error } = await supabaseAdmin
    .from('social_media_posts')
    .delete()
    .eq('id', id)

  if (error) {
    return redirect(`/admin/social?error=${encodeURIComponent(error.message)}`)
  }

  return redirect('/admin/social?success=Enlace+eliminado')
}
