create table public.social_media_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('youtube', 'instagram', 'x')),
  external_id text not null,
  title text,
  description text,
  url text not null,
  image_url text,
  published_at timestamptz,
  inserted_at timestamptz not null default now(),
  source text not null default 'auto' check (source in ('auto', 'manual')),
  priority int not null default 0,
  active boolean not null default true,
  sync_status text not null default 'ok' check (sync_status in ('ok', 'error', 'stale')),
  last_synced_at timestamptz,
  raw_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_id)
);

create index idx_social_media_posts_active_priority on public.social_media_posts(active, priority desc, published_at desc);
create index idx_social_media_posts_platform_published on public.social_media_posts(platform, published_at desc);

create table public.social_media_sources (
  platform text primary key check (platform in ('youtube', 'instagram', 'x')),
  sync_status text not null default 'ok' check (sync_status in ('ok', 'error', 'stale')),
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
