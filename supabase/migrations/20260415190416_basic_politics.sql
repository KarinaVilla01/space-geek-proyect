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