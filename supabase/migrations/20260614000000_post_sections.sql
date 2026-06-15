-- Create post_sections table to manage post types dynamically
create table public.post_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.post_sections enable row level security;

create policy "Public can read sections"
on public.post_sections
for select
to anon, authenticated
using (true);

create policy "Admins can manage sections"
on public.post_sections
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.id = auth.uid()
      and au.is_active = true
      and au.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.id = auth.uid()
      and au.is_active = true
      and au.role = 'admin'
  )
);

-- Seed with the values that were previously hardcoded
insert into public.post_sections (slug, label, sort_order) values
  ('blog',          'Blog',          0),
  ('news',          'News',          1),
  ('tip',           'Tip',           2),
  ('japon',         'Japón',         3),
  ('cultura-otaku', 'Cultura Otaku', 4),
  ('anime',         'Anime',         5),
  ('manga',         'Manga',         6);

-- Drop the hardcoded CHECK constraint on posts.post_type so any section slug is accepted
alter table public.posts drop constraint if exists posts_post_type_check;