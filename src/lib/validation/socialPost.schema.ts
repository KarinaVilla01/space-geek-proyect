import { z } from 'zod';

const platformUrlPatterns = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/i,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
  x: /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/.+/i,
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validatePlatformUrl(platform: keyof typeof platformUrlPatterns, url: string) {
  const pattern = platformUrlPatterns[platform];
  return pattern ? pattern.test(url) : false;
}

export const socialMediaRowSchema = z
  .object({
    platform: z.enum(['youtube', 'instagram', 'x']),
    external_id: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url(),
    image_url: z.string().optional(),
    published_at: z.string().datetime().optional().nullable(),
    inserted_at: z.string().datetime(),
    source: z.enum(['auto', 'manual']),
    priority: z.number().int().nonnegative(),
    active: z.boolean(),
    sync_status: z.enum(['ok', 'error', 'stale']),
    last_synced_at: z.string().datetime().optional().nullable(),
    raw_metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .superRefine((row, ctx) => {
    const titleLength = row.title?.trim().length ?? 0;
    if (titleLength < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Title must be at least 5 characters long',
        path: ['title'],
      });
    }

    if (row.url && !validatePlatformUrl(row.platform, row.url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `URL does not match expected ${row.platform} pattern`,
        path: ['url'],
      });
    }

    if (row.image_url && !isValidUrl(row.image_url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'image_url must be a valid URL',
        path: ['image_url'],
      });
    }
  });
