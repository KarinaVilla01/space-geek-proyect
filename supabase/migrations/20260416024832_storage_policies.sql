create policy "Admins can upload post images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.role = 'admin'
      and au.is_active = true
  )
);

create policy "Admins can update post images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.role = 'admin'
      and au.is_active = true
  )
)
with check (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.role = 'admin'
      and au.is_active = true
  )
);

create policy "Admins can delete post images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.admin_users au
    where au.id = auth.uid()
      and au.role = 'admin'
      and au.is_active = true
  )
);