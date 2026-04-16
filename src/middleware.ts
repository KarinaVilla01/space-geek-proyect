// import type { MiddlewareHandler } from 'astro'
// import { createSupabaseServerClient } from './lib/supabase/server'

// export const onRequest: MiddlewareHandler = async (context, next) => {
//   const pathname = context.url.pathname
//   const isAdminRoute = pathname.startsWith('/admin')
//   const isLoginRoute = pathname === '/admin/login'

//   if (!isAdminRoute) {
//     return next()
//   }

//   const supabase = createSupabaseServerClient(context.request, context.cookies)
//   const {
//     data: { claims },
//     error: claimsError,
//   } = await supabase.auth.getClaims()

//   const userId = claims?.sub ?? null

//   if (!userId) {
//     if (isLoginRoute) return next()
//     return context.redirect('/admin/login')
//   }

//   const { data: adminUser, error: adminError } = await supabase
//     .from('admin_users')
//     .select('id, role, is_active')
//     .eq('id', userId)
//     .maybeSingle()

//   const isAuthorizedAdmin =
//     !claimsError &&
//     !adminError &&
//     !!adminUser &&
//     adminUser.role === 'admin' &&
//     adminUser.is_active === true

//   if (isLoginRoute && isAuthorizedAdmin) {
//     return context.redirect('/admin')
//   }

//   if (!isAuthorizedAdmin) {
//     await supabase.auth.signOut()
//     return context.redirect('/admin/login')
//   }

//   return next()
// }