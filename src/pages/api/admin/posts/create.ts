import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../../lib/supabase'
import { postFormSchema } from '../../../../lib/validation/post.schema'
import { ensureUniqueSlugBase } from '../../../../lib/utils/slug'

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

  const rawTitle = String(formData.get('title') ?? '').trim()
  const rawSlug = String(formData.get('slug') ?? '').trim()
  const rawExcerpt = String(formData.get('excerpt') ?? '').trim()
  const rawContent = String(formData.get('content_md') ?? '').trim()
  const rawPostType = String(formData.get('post_type') ?? 'blog').trim()
  const rawStatus = String(formData.get('status') ?? 'draft').trim()

  const parsed = postFormSchema.safeParse({
    title: rawTitle,
    slug: ensureUniqueSlugBase(rawSlug || rawTitle),
    excerpt: rawExcerpt,
    content_md: rawContent,
    cover_image_url: '',
    status: rawStatus,
    post_type: rawPostType,
  })

  const backParams = new URLSearchParams({
    title: rawTitle,
    slug: rawSlug,
    excerpt: rawExcerpt,
    content_md: rawContent,
    post_type: rawPostType,
    status: rawStatus,
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid form data'
    return redirect(`/admin/posts/new?error=${encodeURIComponent(firstError)}&${backParams.toString()}`)
  }
  
  const values = parsed.data

  const { data: existingSlug } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', values.slug)
    .maybeSingle()

  if (existingSlug) {
    return redirect(
      `/admin/posts/new?error=${encodeURIComponent('Slug already exists')}&${backParams.toString()}`
    )
  }

  const publishedAt = values.status === 'published' ? new Date().toISOString() : null
  
  if (values.status === 'published' && values.content_md.trim().length === 0) {
    return redirect(
      `/admin/posts/new?error=${encodeURIComponent('Content is required to publish a post')}&${backParams.toString()}`
    )
  }

  const { error } = await supabase.from('posts').insert({
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt || null,
    content_md: values.content_md,
    status: values.status,
    post_type: values.post_type,
    published_at: publishedAt,
    author_id: user.id,
  })

  if (error) {
    return redirect(
      `/admin/posts/new?error=${encodeURIComponent(error.message)}&${backParams.toString()}`
    )
  }

  return redirect('/admin/posts/new?success=Post%20saved%20correctly')
}