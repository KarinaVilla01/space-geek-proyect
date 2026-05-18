import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../../lib/supabase'
import { supabaseAdmin } from '../../../../lib/supabase/server'
import { createManualSocialEntry } from '../../../../lib/services/manualSocialService.mjs'
import { normalizeSocialRow } from '../../../../lib/utils/socialUtils'
import { socialEntryFormSchema } from '../../../../lib/validation/socialEntry.schema'

export const prerender = false

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

async function fetchYouTubeOEmbed(url: string): Promise<{ title: string; thumbnail_url: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl)
    if (!res.ok) return null
    return res.json() as Promise<{ title: string; thumbnail_url: string }>
  } catch {
    return null
  }
}

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

  const user = sessionResult.data.user

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminUser || adminUser.role !== 'admin' || adminUser.is_active !== true) {
    return redirect('/admin/loginOscarUnique?error=Not%20authorized')
  }

  const { count: currentCount } = await supabaseAdmin
    .from('social_media_posts')
    .select('*', { count: 'exact', head: true })

  if ((currentCount ?? 0) >= 10) {
    return redirect('/admin/social/new?error=L%C3%ADmite+m%C3%A1ximo+de+10+enlaces+alcanzado.+Elimina+uno+antes+de+agregar+otro.')
  }

  const formData = await request.formData()

  const rawValues = {
    platform: String(formData.get('platform') ?? '').trim(),
    url: String(formData.get('url') ?? '').trim(),
    external_id: String(formData.get('external_id') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    image_url: String(formData.get('image_url') ?? '').trim(),
    published_at: String(formData.get('published_at') ?? '').trim(),
    priority: String(formData.get('priority') ?? '0').trim(),
    active: String(formData.get('active') ?? 'false'),
  }

  const parsed = socialEntryFormSchema.safeParse(rawValues)

  const errorBackUrl = `/admin/social/new?platform=${rawValues.platform}&url=${encodeURIComponent(rawValues.url)}`

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos del formulario inválidos'
    return redirect(`${errorBackUrl}&error=${encodeURIComponent(firstError)}`)
  }

  const values = parsed.data
  let external_id = values.external_id || ''
  let title = values.title || ''
  let image_url = values.image_url || ''
  const priorityValue = Number(values.priority) || 0
  const activeValue = values.active === 'on' || values.active === 'true'
  const publishedAt = values.published_at ? new Date(values.published_at).toISOString() : null

  if (values.platform === 'youtube') {
    const videoId = extractYouTubeId(values.url)
    if (!videoId) {
      return redirect(`${errorBackUrl}&error=${encodeURIComponent('URL de YouTube no válida. Usa formato youtube.com/watch?v=... o youtu.be/...')}`)
    }
    external_id = videoId

    const oembed = await fetchYouTubeOEmbed(values.url)
    if (oembed) {
      if (!title) title = oembed.title
      if (!image_url) image_url = oembed.thumbnail_url
    }

    if (!title) {
      return redirect(`${errorBackUrl}&error=${encodeURIComponent('No se pudo obtener el título del video. Agrega un título manualmente.')}`)
    }
  } else {
    if (!external_id) {
      return redirect(`${errorBackUrl}&error=${encodeURIComponent('El ID externo es requerido para Instagram y X')}`)
    }
    if (title.length < 5) {
      return redirect(`${errorBackUrl}&error=${encodeURIComponent('El título debe tener al menos 5 caracteres')}`)
    }
  }

  const manualRow = createManualSocialEntry({
    platform: values.platform,
    external_id,
    url: values.url,
    title,
    description: values.description || '',
    image_url,
    published_at: publishedAt,
    priority: priorityValue,
    active: activeValue,
  })

  const normalized = await normalizeSocialRow({
    ...manualRow,
    inserted_at: new Date().toISOString(),
    sync_status: 'ok',
    last_synced_at: null,
    raw_metadata: {},
  })

  const { error } = await supabaseAdmin
    .from('social_media_posts')
    .upsert(normalized, { onConflict: 'platform,external_id' })

  if (error) {
    return redirect(`${errorBackUrl}&error=${encodeURIComponent(error.message)}`)
  }

  return redirect('/admin/social/new?success=Video%20guardado%20correctamente')
}
