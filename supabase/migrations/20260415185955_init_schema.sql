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
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  post_type text not null default 'blog' check (post_type in ('blog', 'news', 'tip')),
  published_at timestamptz,
  author_id uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_posts_author_id on public.posts(author_id);

alter table public.admin_users enable row level security;
alter table public.posts enable row level security;

create policy "Admin can read own admin profile"
on public.admin_users
for select
to authenticated
using (id = auth.uid());

create policy "Public can read published posts"
on public.posts
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage posts"
on public.posts
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.is_active = true
      and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.is_active = true
      and au.role = 'admin'
  )
);