import { socialMediaRowSchema } from '../validation/socialPost.schema';

const platformImageDomains = {
  youtube: ['i.ytimg.com', 'img.youtube.com'],
  instagram: ['instagram.f', 'scontent.cdninstagram.com', 'instagram.com'],
  x: ['pbs.twimg.com', 'video.twimg.com', 'pxtwitter.com', 'x.com', 'twitter.com'],
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

async function isImageReachable(imageUrl: string) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

function isAllowedImageDomain(platform: keyof typeof platformImageDomains, imageUrl: string) {
  if (!imageUrl) return false;
  try {
    const { hostname } = new URL(imageUrl);
    const allowed = platformImageDomains[platform] ?? [];
    return allowed.some((domain) => hostname.includes(domain));
  } catch {
    return false;
  }
}

export async function normalizeSocialRow(row: any) {
  const normalized = {
    platform: row.platform,
    external_id: row.external_id,
    title: row.title?.trim() ?? '',
    description: row.description?.trim() ?? '',
    url: row.url,
    image_url: row.image_url?.trim() || undefined,
    published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
    inserted_at: row.inserted_at ? new Date(row.inserted_at).toISOString() : new Date().toISOString(),
    source: row.source ?? 'auto',
    priority: Number.isFinite(row.priority) ? row.priority : 0,
    active: row.active === false ? false : true,
    sync_status: row.sync_status ?? 'ok',
    last_synced_at: row.last_synced_at ? new Date(row.last_synced_at).toISOString() : null,
    raw_metadata: row.raw_metadata ?? {},
  };

  if (normalized.image_url) {
    if (!isAllowedImageDomain(normalized.platform, normalized.image_url)) {
      normalized.image_url = undefined;
    } else if (!(await isImageReachable(normalized.image_url))) {
      normalized.image_url = undefined;
    }
  }

  return socialMediaRowSchema.parse(normalized);
}
