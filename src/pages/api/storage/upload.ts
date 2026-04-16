import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../lib/supabase'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseClient()

  const accessToken = cookies.get('sb-access-token')
  const refreshToken = cookies.get('sb-refresh-token')

  if (!accessToken || !refreshToken) {
    return redirect('/admin/login')
  }

  const sessionResult = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (sessionResult.error || !sessionResult.data.user) {
    cookies.delete('sb-access-token', { path: '/' })
    cookies.delete('sb-refresh-token', { path: '/' })
    return redirect('/admin/login')
  }

  const user = sessionResult.data.user

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminUser || adminUser.role !== 'admin' || adminUser.is_active !== true) {
    return redirect('/admin/login?error=Not%20authorized')
  }

  const formData = await request.formData()
  const file = formData.get('cover_image')

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file received' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const filePath = `drafts/${user.id}/cover-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: false,
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ path: filePath }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}