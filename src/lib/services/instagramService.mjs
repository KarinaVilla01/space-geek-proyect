export function createInstagramManualEntry(data) {
  return {
    platform: 'instagram',
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
      caption: data.caption,
      provider: 'instagram',
    },
  };
}
