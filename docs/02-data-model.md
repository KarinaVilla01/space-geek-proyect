# Data Model

## 1. Propósito
Este documento define el modelo de datos inicial del proyecto, incluyendo las entidades principales, sus campos, relaciones y reglas de negocio asociadas.

La versión inicial del sistema se basa en un modelo simple orientado a:
- un solo administrador
- publicaciones de contenido
- visibilidad pública solo para contenido publicado

## 2. Entidades principales
En la versión inicial, el sistema utilizará las siguientes entidades:

- `auth.users` (gestionada por Supabase Auth)
- `admin_users`
- `posts`

## 3. Entidad: auth.users
Esta entidad es gestionada por Supabase Auth y representa las credenciales del usuario autenticado.

No será administrada directamente desde la aplicación como tabla funcional del proyecto, pero servirá como base para relacionar al administrador del sistema.

### Propósito
- almacenar identidad y autenticación del administrador
- permitir login seguro
- permitir cambio de contraseña

### Notas
- la contraseña no será almacenada manualmente en tablas propias del proyecto
- la autenticación será delegada a Supabase Auth

## 4. Entidad: admin_users

### Propósito
Representa al usuario con permiso para administrar el contenido del sistema.

Esta tabla se usa para autorización dentro del sistema, no para almacenar contraseñas.

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `id` | `uuid` | Sí | Identificador del administrador. Debe coincidir con `auth.users.id`. |
| `email` | `text` | Sí | Correo del administrador. Debe ser único. |
| `role` | `text` | Sí | Rol del usuario. En v1 será `admin`. |
| `is_active` | `boolean` | Sí | Indica si la cuenta administrativa está activa. |
| `created_at` | `timestamptz` | Sí | Fecha de creación del registro. |

### Reglas
- solo debe existir una cuenta administrativa activa en la versión inicial
- el campo `email` debe ser único
- el campo `role` en v1 solo tendrá el valor `admin`
- `admin_users.id` debe relacionarse con `auth.users.id`

## 5. Entidad: posts

### Propósito
Representa cada publicación de contenido mostrada o administrada en el sistema.

Un post puede corresponder a alguno de los tipos definidos en v1:
- `blog`
- `news`
- `tip`

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `id` | `uuid` | Sí | Identificador único de la publicación. |
| `title` | `text` | Sí | Título principal del post. |
| `slug` | `text` | Sí | Identificador único para URL amigable. |
| `excerpt` | `text` | No | Resumen corto del contenido. |
| `content_html` | `text` | Sí | Contenido principal de la publicación. |
| `cover_image_path` | `text` | No | URL o ruta de imagen destacada. |
| `status` | `text` | Sí | Estado de la publicación: `draft`, `published` o `archived`. |
| `post_type` | `text` | Sí | Tipo de contenido: `blog`, `news` o `tip`. |
| `published_at` | `timestamptz` | No | Fecha de publicación. Se asigna automáticamente al publicar. |
| `author_id` | `uuid` | No | Referencia al administrador creador o editor del post. |
| `created_at` | `timestamptz` | Sí | Fecha de creación del registro. |
| `updated_at` | `timestamptz` | Sí | Fecha de última actualización del registro. |

### Reglas
- `slug` debe ser único
- `title` es obligatorio
- `content_html` es obligatorio
- `status` solo puede ser:
  - `draft`
  - `published`
  - `archived`
- `post_type` solo puede ser:
  - `blog`
  - `news`
  - `tip`
- una publicación con `status = draft` no debe mostrarse públicamente
- una publicación con `status = archived` no debe mostrarse públicamente
- una publicación con `status = published` sí debe mostrarse públicamente
- `published_at` debe generarse automáticamente cuando el post cambie a `published`
- `published_at` puede permanecer almacenado aunque el post pase después a `archived`

## 6. Relaciones

### 6.1 auth.users -> admin_users
- relación uno a uno lógica
- `admin_users.id` referencia `auth.users.id`

### Restricción operativa
La creación de registros en `admin_users` no estará disponible desde la interfaz de usuario en v1. La cuenta administrativa inicial será creada por configuración del sistema.

### 6.2 admin_users -> posts
- relación uno a muchos
- un administrador puede crear o gestionar múltiples publicaciones
- un post puede estar asociado a un administrador por medio de `author_id`

## 7. Enumeraciones lógicas

### 7.1 Post Status
Valores permitidos:
- `draft`
- `published`
- `archived`

### 7.2 Post Type
Valores permitidos:
- `blog`
- `news`
- `tip`

### 7.3 User Role
Valores permitidos en v1:
- `admin`

## 8. Reglas de integridad
- no debe existir más de un administrador activo en la versión inicial
- no deben existir slugs duplicados
- no deben existir posts públicos con estado distinto de `published`
- el contenido público siempre debe provenir de registros válidos en `posts`
- el acceso administrativo debe depender de una cuenta autenticada y autorizada

## 9. Consideraciones de implementación
- la autenticación será manejada por Supabase Auth
- la autorización del panel se apoyará en la tabla `admin_users`
- las restricciones de `status` y `post_type` deben implementarse en la base de datos
- las tablas expuestas al frontend deberán usar Row Level Security (RLS)
- los posts públicos deberán filtrarse por `status = 'published'`

## 10. Campos o entidades fuera de alcance en v1
Las siguientes entidades o campos no forman parte del modelo inicial:
- comentarios
- likes o reacciones
- múltiples administradores funcionales
- categorías avanzadas
- tags
- programación de publicaciones
- historial editorial
- borrado lógico complejo
- auditoría avanzada de cambios