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

    const id = String(formData.get('id') ?? '').trim()
    const rawTitle = String(formData.get('title') ?? '').trim()
    const rawSlug = String(formData.get('slug') ?? '').trim()
    const rawExcerpt = String(formData.get('excerpt') ?? '').trim()
    const rawContent = String(formData.get('content_html') ?? '')
    const rawPostType = String(formData.get('post_type') ?? 'blog').trim()
    const rawStatus = String(formData.get('status') ?? 'draft').trim()

    if (!id) {
        return redirect('/admin/posts?error=Missing%20post%20id')
    }

    const parsed = postFormSchema.safeParse({
        title: rawTitle,
        slug: ensureUniqueSlugBase(rawSlug || rawTitle),
        excerpt: rawExcerpt,
        content_html: rawContent,
        cover_image_path: '',
        status: rawStatus,
        post_type: rawPostType,
    })

    const backParams = new URLSearchParams({
        title: rawTitle,
        slug: rawSlug,
        excerpt: rawExcerpt,
        content_html: rawContent,
        post_type: rawPostType,
        status: rawStatus,
    })

    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? 'Invalid form data'
        return redirect(`/admin/posts/${id}/edit?error=${encodeURIComponent(firstError)}&${backParams.toString()}`)
    }

    const values = parsed.data

    if (values.status === 'published' && values.content_html.trim().length === 0) {
        return redirect(
            `/admin/posts/${id}/edit?error=${encodeURIComponent('Content is required to publish a post')}&${backParams.toString()}`
        )
    }

    const { data: existingSlug } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', values.slug)
        .neq('id', id)
        .maybeSingle()

    if (existingSlug) {
        return redirect(
            `/admin/posts/${id}/edit?error=${encodeURIComponent('Slug already exists')}&${backParams.toString()}`
        )
    }

    const { data: currentPost } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', id)
        .maybeSingle()

    let publishedAt = currentPost?.published_at ?? null

    if (values.status === 'published' && !publishedAt) {
        publishedAt = new Date().toISOString()
    }

    let coverImagePath: string | null = null

    const file = formData.get('cover_image')

    const hasFile =
        file instanceof File ||
        (file && typeof (file as any).size === 'number' && typeof (file as any).name === 'string')

    if (hasFile && (file as File).size > 0) {
        const uploadFile = file as File
        const ext = uploadFile.name.split('.').pop()?.toLowerCase() || 'bin'
        const filePath = `drafts/${user.id}/cover-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, uploadFile, {
                cacheControl: '3600',
                contentType: uploadFile.type || undefined,
                upsert: false,
            })

        if (uploadError) {
            return redirect(
                `/admin/posts/${id}/edit?error=${encodeURIComponent(uploadError.message)}&${backParams.toString()}`
            )
        }

        coverImagePath = filePath
    }

    const updateData: Record<string, unknown> = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt || null,
        content_html: values.content_html,
        status: values.status,
        post_type: values.post_type,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
    }

    if (coverImagePath) {
        updateData.cover_image_path = coverImagePath
    }

    const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select()

    if (error) {
        return redirect(
            `/admin/posts/${id}/edit?error=${encodeURIComponent(error.message)}&${backParams.toString()}`
        )
    }

    return redirect(`/admin/posts/${id}/edit?success=Post%20updated%20correctly`)
}