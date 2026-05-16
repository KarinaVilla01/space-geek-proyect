SELECT *
FROM public.admin_users

INSERT INTO public.admin_users (id, email, role, is_active)
SELECT id, email, 'admin', true
FROM auth.users
WHERE email = 'fil.01.21@gmail.com';

SELECT a.email, au.role, au.is_active
FROM auth.users a
JOIN public.admin_users au ON a.id = au.id;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', false)
on conflict (id) do nothing;

UPDATE storage.buckets SET public = true WHERE id = 'post-images';
