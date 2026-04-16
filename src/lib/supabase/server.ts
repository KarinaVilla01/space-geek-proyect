// import { createSupabaseClient, parseCookieHeader } from '@supabase/ssr'
// import type { AstroCookies } from 'astro'

// const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// if (!supabaseUrl) throw new Error('Missing PUBLIC_SUPABASE_URL')
// if (!supabaseAnonKey) throw new Error('Missing PUBLIC_SUPABASE_ANON_KEY')

// export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
//   return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
//     cookies: {
//       getAll() {
//         return parseCookieHeader(request.headers.get('Cookie') ?? '')
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value, options }) => {
//           cookies.set(name, value, options)
//         })
//       },
//     },
//   })
// }