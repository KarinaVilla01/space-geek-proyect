import { supabase } from '../../../lib/supabase/client.ts';

export const prerender = false;

export async function GET() {
  const { data, error } = await supabase
    .from('social_media_posts')
    .select('id, platform, title, description, url, image_url, published_at, inserted_at, source, priority')
    .eq('active', true)
    .order('priority', { ascending: false })
    .order('inserted_at', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(JSON.stringify({ error: 'DB_FETCH_FAILED' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const items = (data ?? []).map(item => ({
    id: item.id,
    platform: item.platform,
    title: item.title?.trim() || 'Ver contenido',
    description: item.description?.trim() || '',
    url: item.url,
    image_url: item.image_url?.trim() || null,
    published_at: item.published_at || item.inserted_at,
    priority: item.priority,
  }));

  return new Response(JSON.stringify(items), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
    },
  });
}
