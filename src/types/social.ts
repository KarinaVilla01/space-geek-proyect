export interface SocialMediaItem {
  id: string;
  platform: 'youtube' | 'instagram' | 'x';
  external_id: string;
  title?: string;
  description?: string;
  url: string;
  image_url?: string;
  published_at?: string;
  inserted_at: string;
  source: 'auto' | 'manual';
  priority: number;
  active: boolean;
  sync_status: 'ok' | 'error' | 'stale';
  last_synced_at?: string;
  raw_metadata?: Record<string, unknown>;
}
