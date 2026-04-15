create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_md text not null default '',
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  post_type text not null default 'blog' check (post_type in ('blog', 'news', 'tip')),
  published_at timestamptz,
  author_id uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);