# Project Overview

## Nombre del proyecto
SpaceGeek Content Site

## Resumen
Este proyecto consiste en desarrollar un sitio web público orientado a la publicación de contenido editorial por parte de un único administrador.

El sitio permitirá mostrar publicaciones como blogs, noticias y consejos para cualquier visitante, sin necesidad de que los usuarios públicos creen cuentas o inicien sesión.

La administración del contenido se realizará a través de un panel privado al que solo tendrá acceso el administrador del sitio.

## Objetivo
Construir una plataforma web simple, de bajo costo y fácil de mantener, que permita al cliente publicar contenido de forma autónoma sin depender del desarrollador para cada nueva publicación.

## Problema que resuelve
Actualmente, el cliente necesita una forma centralizada de publicar contenido en su sitio web sin requerir cambios manuales en el código cada vez que quiera agregar una nueva entrada.

El proyecto busca resolver esta necesidad mediante un panel de administración privado donde el cliente pueda crear, editar, guardar y publicar contenido, el cual se reflejará automáticamente en el sitio público.

## Usuarios
### 1. Administrador
Usuario único con acceso al panel privado para:
- iniciar sesión
- crear publicaciones
- editar publicaciones
- guardar borradores
- publicar contenido
- gestionar imágenes asociadas a publicaciones

### 2. Visitante público
Usuario sin cuenta, que podrá:
- navegar el sitio
- ver publicaciones publicadas
- abrir el detalle de cada publicación

## Autenticación del administrador
La versión inicial contará con una única cuenta de administrador.

El acceso al panel administrativo se realizará a través de una pantalla de login independiente del sitio público. Solo el administrador autenticado podrá acceder al área privada del sistema para crear, editar, guardar y publicar contenido.

No existirá registro público de usuarios ni creación de nuevas cuentas administrativas desde la interfaz.

La autenticación será gestionada de forma segura mediante el sistema de autenticación del backend, mientras que la autorización del panel se limitará a una sola cuenta administrativa activa.

El administrador podrá actualizar su contraseña cuando sea necesario.## Autenticación del administrador
La versión inicial contará con una única cuenta de administrador.

El acceso al panel administrativo se realizará a través de una pantalla de login independiente del sitio público. Solo el administrador autenticado podrá acceder al área privada del sistema para crear, editar, guardar y publicar contenido.

No existirá registro público de usuarios ni creación de nuevas cuentas administrativas desde la interfaz.

La autenticación será gestionada de forma segura mediante el sistema de autenticación del backend, mientras que la autorización del panel se limitará a una sola cuenta administrativa activa.

El administrador podrá actualizar su contraseña cuando sea necesario.

## Alcance v1
La primera versión del proyecto incluirá:

- sitio web público
- panel de administración privado
- autenticación para un solo administrador
- creación de publicaciones
- edición de publicaciones
- guardado de borradores
- publicación de contenido
- visualización pública de publicaciones publicadas
- manejo básico de imagen destacada por publicación
- estructura inicial para tipos de publicación como blog, noticia o consejo
- URLs amigables mediante slug
- base de datos para almacenar publicaciones y datos del administrador

## Fuera de alcance
La versión inicial NO incluirá:

- registro de usuarios públicos
- múltiples administradores o roles avanzados
- comentarios
- likes o reacciones
- membresías o suscripciones
- newsletter
- programación avanzada de publicaciones
- editor visual complejo tipo WordPress/Notion
- panel de analítica avanzada
- sistema de búsqueda avanzada
- app móvil

## Stack tentativo
- Frontend: Astro
- Backend / Base de datos / Auth / Storage: Supabase
- Hosting / Runtime: Cloudflare Workers
- Lenguaje principal: TypeScript

## Resultado esperado
Al finalizar la versión inicial, el cliente deberá poder:

1. ingresar al panel de administración
2. crear una publicación con título, contenido e imagen
3. guardarla como borrador o publicarla
4. visualizar automáticamente las publicaciones publicadas en el sitio web público

## Riesgos o decisiones pendientes
Los siguientes puntos aún deben definirse o confirmarse:

- si el contenido se editará como texto enriquecido o Markdown
- si las publicaciones usarán categorías, tags o solo un tipo de publicación
- si la portada de cada publicación será obligatoria o opcional
- si habrá páginas adicionales como "Acerca de" o "Contacto" en la versión inicial