
insert into public.posts (
  title,
  slug,
  excerpt,
  content_md,
  status,
  post_type,
  published_at
)
values
(
  'Super Mario Galaxy 1 + 2 alcanza su precio mínimo histórico en Amazon',
  'super-mario-galaxy-precio-minimo-historico-amazon',
  'El recopilatorio de Super Mario Galaxy para Nintendo Switch baja su precio más bajo hasta la fecha en Amazon.',
  'Contenido de prueba para validar el flujo público del sitio. Este post debe aparecer en /posts porque está publicado.',
  'published',
  'blog',
  now()
),
(
  'Nintendo prepara nuevas funciones online para Switch',
  'nintendo-prepara-nuevas-funciones-online-switch',
  'Post en borrador para validar que no aparezca en el sitio público.',
  'Este contenido está en draft y no debe verse en /posts.',
  'draft',
  'news',
  null
),
(
  'Consejo rápido para cuidar tus controles',
  'consejo-rapido-cuidar-controles',
  'Post archivado para validar que tampoco aparezca en el sitio público.',
  'Este contenido está archivado y no debe verse en /posts.',
  'archived',
  'tip',
  now()
);