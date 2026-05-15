export function createManualSocialEntry({
  platform,
  external_id,
  url,
  title,
  image_url,
  description,
  published_at,
  priority = 0,
  active = true,
}) {
  if (!platform || !external_id || !url) {
    throw new Error('manual social entry requires platform, external_id and url');
  }

  return {
    platform,
    external_id,
    source: 'manual',
    title: title?.trim() ?? '',
    description: description?.trim() ?? '',
    url,
    image_url: image_url?.trim() ?? '',
    published_at: published_at ?? null,
    priority,
    active,
  };
}
