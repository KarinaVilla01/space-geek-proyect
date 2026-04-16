import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../lib/supabase'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return redirect('/admin/login?error=Missing%20credentials')
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session || !data.user) {
    return redirect('/admin/login?error=Invalid%20credentials')
  }

  const { access_token, refresh_token } = data.session

  cookies.set('sb-access-token', access_token, { path: '/' })
  cookies.set('sb-refresh-token', refresh_token, { path: '/' })

  return redirect('/admin')
}