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
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    return redirect('/admin/sections?error=' + encodeURIComponent('ID de sección inválido'))
  }

  const { data: section } = await supabaseAdmin
    .from('post_sections')
    .select('id, slug')
    .eq('id', id)
    .maybeSingle()

  if (!section) {
    return redirect('/admin/sections?error=' + encodeURIComponent('Sección no encontrada'))
  }

  // Check if any posts use this section
  const { count } = await supabaseAdmin
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('post_type', section.slug)

  if (count && count > 0) {
    return redirect(
      '/admin/sections?error=' +
        encodeURIComponent(`No se puede eliminar: hay ${count} publicación(es) usando esta sección`)
    )
  }

  const { error } = await supabaseAdmin
    .from('post_sections')
    .delete()
    .eq('id', id)

  if (error) {
    return redirect('/admin/sections?error=' + encodeURIComponent(error.message))
  }

  return redirect('/admin/sections?success=' + encodeURIComponent('Sección eliminada correctamente'))
}
