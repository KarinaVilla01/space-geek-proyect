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
  const label = String(formData.get('label') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()

  if (!label || !slug) {
    return redirect('/admin/sections?error=' + encodeURIComponent('El nombre y el slug son obligatorios'))
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return redirect('/admin/sections?error=' + encodeURIComponent('El slug solo puede contener letras minúsculas, números y guiones'))
  }

  const { data: existing } = await supabaseAdmin
    .from('post_sections')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return redirect('/admin/sections?error=' + encodeURIComponent('Ya existe una sección con ese slug'))
  }

  const { data: last } = await supabaseAdmin
    .from('post_sections')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sort_order = last ? last.sort_order + 1 : 0

  const { error } = await supabaseAdmin
    .from('post_sections')
    .insert({ slug, label, sort_order })

  if (error) {
    return redirect('/admin/sections?error=' + encodeURIComponent(error.message))
  }

  return redirect('/admin/sections?success=' + encodeURIComponent('Sección creada correctamente'))
}
