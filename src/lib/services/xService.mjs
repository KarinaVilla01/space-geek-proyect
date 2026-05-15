export function createXManualEntry(data) {
  return {
    platform: 'x',
    external_id: data.external_id,
    source: 'manual',
    title: data.title?.trim() ?? '',
    description: data.description?.trim() ?? '',
    url: data.url,
    image_url: data.image_url?.trim() ?? '',
    published_at: data.published_at ?? null,
    priority: data.priority ?? 0,
    active: data.active ?? true,
    raw_metadata: {
      tweet_id: data.tweet_id,
      provider: 'x',
    },
  };
}
