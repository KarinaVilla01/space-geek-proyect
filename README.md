# SpaceGeek

Sitio web editorial con panel de administración privado. El administrador crea y publica artículos de blog, noticias y tips, y gestiona una lista de enlaces a contenido en redes sociales (YouTube, Instagram, X) que se muestran en la página de inicio.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (SSR) |
| Lenguaje | TypeScript |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Supabase Auth |
| Almacenamiento de imágenes | Supabase Storage |
| Editor de contenido | TinyMCE |
| Validación | Zod |
| Hosting / Runtime | Cloudflare Workers |

---

## Requisitos previos

- Node.js **>= 22.12.0**
- Cuenta en [Supabase](https://supabase.com) con un proyecto creado
- Cuenta en [Cloudflare](https://cloudflare.com) (para despliegue)
- API key de [TinyMCE](https://www.tiny.cloud) (editor de contenido)

---

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

```env
# Supabase
PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# TinyMCE
PUBLIC_TINYMCE_API_KEY=<api-key>

# App
PUBLIC_SITE_URL=http://localhost:4321
```

Las claves de Supabase se encuentran en **Project Settings → API** dentro del dashboard de Supabase.

### 3. Ejecutar las migraciones de base de datos

Desde el panel de Supabase, ve a **SQL Editor** y ejecuta en orden los archivos de la carpeta `supabase/migrations/`:

1. `20260415185955_init_schema.sql` — tablas `posts` y `admin_users`
2. `20260416024832_storage_policies.sql` — políticas de almacenamiento
3. `20260505130000_social_media_posts.sql` — tabla `social_media_posts`

### 4. Cargar datos de prueba (seed)

El archivo `supabase/seed.sql` inserta posts de ejemplo para validar el flujo público del sitio. **Solo se ejecuta al correr:**

```bash
npx supabase db reset
```

> `supabase start` **no** vuelve a aplicar el seed. Solo `db reset` lo hace.

Si quieres correr el seed sin resetear toda la base de datos:

```bash
npx supabase db execute --file supabase/seed.sql
```

> **Importante:** `db reset` elimina todos los datos, incluyendo el usuario administrador. Después de cada reset debes volver a crearlo (ver paso siguiente).

---

### 5. Crear el primer usuario administrador

**Paso 1 — Crear el usuario en Supabase Auth:**

En el dashboard de Supabase, ve a **Authentication → Users → Invite user** e invita el correo del administrador. El usuario recibirá un correo para establecer su contraseña.

**Paso 2 — Registrarlo como admin en la base de datos:**

En el **SQL Editor** de Supabase, ejecuta:

```sql
INSERT INTO admin_users (id, email, role, is_active)
VALUES (
  '<uuid-del-usuario>',   -- cópialo de Authentication → Users
  'correo@ejemplo.com',
  'admin',
  true
);
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`.

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Preview local del build de producción |
| `npm run local` | Servidor local simulando el entorno de Cloudflare Workers |
| `npm run generate-types` | Genera tipos TypeScript desde Wrangler |

---

## Rutas principales

### Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con artículos recientes y contenido social |
| `/posts` | Listado de todos los artículos publicados |
| `/posts/[slug]` | Detalle de un artículo |
| `/about` | Página "Acerca de" |

### Panel de administración (`/admin`)

Acceso restringido a usuarios registrados en la tabla `admin_users`.

| Ruta | Descripción |
|------|-------------|
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard principal |
| `/admin/posts` | Listado de artículos (borradores, publicados, archivados) |
| `/admin/posts/new` | Crear nuevo artículo |
| `/admin/posts/[id]/edit` | Editar artículo existente |
| `/admin/social` | Gestionar enlaces de YouTube, Instagram y X |

---

## Gestión de contenido social

En `/admin/social` el administrador puede agregar hasta **10 URLs por plataforma** (YouTube, Instagram, X). Los cambios reemplazan la lista completa al guardar.

- **YouTube:** se extrae el ID del video automáticamente y se obtiene el título y miniatura vía YouTube oEmbed (sin API key).
- **Instagram / X:** se extrae el ID de la URL. No se requieren credenciales de API.

Los enlaces guardados aparecen en el panel derecho de la página de inicio, agrupados por plataforma.

---

## Despliegue en Cloudflare Workers

### 1. Configurar el nombre del proyecto

En `wrangler.jsonc`, reemplaza el campo `name` con el nombre real de tu Worker en Cloudflare.

### 2. Variables de entorno en producción

En el dashboard de Cloudflare, ve a **Workers & Pages → tu-worker → Settings → Variables** y agrega las mismas variables del `.env.local` (excepto las `PUBLIC_*`, que se inyectan en el build).

O bien, agrégalas directamente en `wrangler.jsonc` bajo `[vars]` para variables no sensibles.

### 3. Build y deploy

```bash
npm run build
npx wrangler deploy
```

---

## Estructura del proyecto

```
SpaceGeek/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página de inicio
│   │   ├── posts/               # Rutas públicas de artículos
│   │   ├── admin/               # Panel de administración (protegido)
│   │   └── api/                 # Endpoints de la API
│   ├── layouts/                 # Layouts reutilizables
│   ├── lib/
│   │   ├── supabase/            # Clientes Supabase (cliente y servidor)
│   │   ├── services/            # Servicios de redes sociales
│   │   ├── validation/          # Esquemas Zod
│   │   └── utils/               # Utilidades generales
│   ├── types/                   # Tipos TypeScript
│   └── styles/                  # Estilos globales
├── supabase/
│   └── migrations/              # Migraciones SQL de la base de datos
├── docs/                        # Documentación del proyecto (PRD, arquitectura)
├── .env.example                 # Plantilla de variables de entorno
├── astro.config.mjs
└── wrangler.jsonc               # Configuración de Cloudflare Workers
```

---

## Documentación adicional

La carpeta `docs/` contiene documentación detallada del proyecto:

- `00-project-overview.md` — Visión general y alcance
- `01-prd.md` — Requisitos del producto
- `02-data-model.md` — Modelo de datos
- `03-architecture.md` — Arquitectura técnica
- `04-backlog-v1.md` — Backlog de funcionalidades
- `05-decisions-log.md` — Registro de decisiones técnicas
