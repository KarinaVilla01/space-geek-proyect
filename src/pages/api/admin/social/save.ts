import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../../lib/supabase'
import { supabaseAdmin } from '../../../../lib/supabase/server'

export const prerender = false

const MAX_PER_PLATFORM = 10

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function extractInstagramId(url: string): string | null {
  if (!url.includes('instagram.com')) return null
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)
  if (m) return m[1]
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || null
}

function extractXId(url: string): string | null {
  if (!url.includes('x.com') && !url.includes('twitter.com')) return null
  const m = url.match(/\/status\/(\d+)/)
  if (m) return m[1]
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || null
}

async function fetchYouTubeOEmbed(url: string): Promise<{ title: string; thumbnail_url: string } | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseClient()

  const accessToken = cookies.get('sb-access-token')
  const refreshToken = cookies.get('sb-refresh-token')

  if (!accessToken || !refreshToken) return redirect('/admin/loginOscarUnique')

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

  const youtubeUrls = formData.getAll('youtube_url').map(v => String(v).trim()).filter(Boolean)
  const instagramUrls = formData.getAll('instagram_url').map(v => String(v).trim()).filter(Boolean)
  const xUrls = formData.getAll('x_url').map(v => String(v).trim()).filter(Boolean)

  if (youtubeUrls.length > MAX_PER_PLATFORM || instagramUrls.length > MAX_PER_PLATFORM || xUrls.length > MAX_PER_PLATFORM) {
    return redirect(`/admin/social?error=${encodeURIComponent(`Máximo ${MAX_PER_PLATFORM} URLs por plataforma`)}`)
  }

  const rows: Record<string, unknown>[] = []
  const now = new Date().toISOString()

  for (let i = 0; i < youtubeUrls.length; i++) {
    const url = youtubeUrls[i]
    const videoId = extractYouTubeId(url)
    if (!videoId) {
      return redirect(`/admin/social?error=${encodeURIComponent(`URL de YouTube inválida: ${url}`)}`)
    }
    const oembed = await fetchYouTubeOEmbed(url)
    rows.push({
      platform: 'youtube',
      external_id: videoId,
      url,
      title: oembed?.title || `Video ${videoId}`,
      image_url: oembed?.thumbnail_url || null,
      description: '',
      source: 'manual',
      active: true,
      priority: youtubeUrls.length - i,
      sync_status: 'ok',
      inserted_at: now,
    })
  }

  for (let i = 0; i < instagramUrls.length; i++) {
    const url = instagramUrls[i]
    const postId = extractInstagramId(url)
    if (!postId) {
      return redirect(`/admin/social?error=${encodeURIComponent(`URL de Instagram inválida: ${url}`)}`)
    }
    rows.push({
      platform: 'instagram',
      external_id: postId,
      url,
      title: 'Instagram post',
      image_url: null,
      description: '',
      source: 'manual',
      active: true,
      priority: instagramUrls.length - i,
      sync_status: 'ok',
      inserted_at: now,
    })
  }

  for (let i = 0; i < xUrls.length; i++) {
    const url = xUrls[i]
    const tweetId = extractXId(url)
    if (!tweetId) {
      return redirect(`/admin/social?error=${encodeURIComponent(`URL de X inválida: ${url}`)}`)
    }
    rows.push({
      platform: 'x',
      external_id: tweetId,
      url,
      title: 'X post',
      image_url: null,
      description: '',
      source: 'manual',
      active: true,
      priority: xUrls.length - i,
      sync_status: 'ok',
      inserted_at: now,
    })
  }

  const { error: deleteError } = await supabaseAdmin
    .from('social_media_posts')
    .delete()
    .in('platform', ['youtube', 'instagram', 'x'])

  if (deleteError) {
    return redirect(`/admin/social?error=${encodeURIComponent(deleteError.message)}`)
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from('social_media_posts')
      .insert(rows)

    if (insertError) {
      return redirect(`/admin/social?error=${encodeURIComponent(insertError.message)}`)
    }
  }

  return redirect('/admin/social?success=Cambios+guardados+correctamente')
}
