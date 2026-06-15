import type { MiddlewareHandler } from 'astro'
import { createSupabaseClient } from './lib/supabase'

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/admin/loginOscarUnique'

  if (!isAdminRoute) {
    return next()
  }

  const accessToken = context.cookies.get('sb-access-token')
  const refreshToken = context.cookies.get('sb-refresh-token')

  // No hay cookies → solo permitir la página de login
  if (!accessToken?.value || !refreshToken?.value) {
    if (isLoginRoute) return next()
    return context.redirect('/admin/loginOscarUnique')
  }

  // Validar sesión con Supabase
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (error || !data.user) {
    context.cookies.delete('sb-access-token', { path: '/' })
    context.cookies.delete('sb-refresh-token', { path: '/' })
    if (isLoginRoute) return next()
    return context.redirect('/admin/loginOscarUnique')
  }

  // Verificar que el usuario está en admin_users con rol activo
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', data.user.id)
    .maybeSingle()

  const isAuthorized =
    !!adminUser &&
    (adminUser.role === 'admin' || adminUser.role === 'editor') &&
    adminUser.is_active === true

  // Usuario autorizado intenta entrar al login → mandarlo al panel
  if (isLoginRoute && isAuthorized) {
    return context.redirect('/admin')
  }

  // Usuario no autorizado en ruta admin → limpiar y mandar al login
  if (!isAuthorized) {
    context.cookies.delete('sb-access-token', { path: '/' })
    context.cookies.delete('sb-refresh-token', { path: '/' })
    return context.redirect('/admin/loginOscarUnique')
  }

  return next()
}
