# Architecture

## 1. Propósito
Este documento describe la arquitectura técnica inicial del proyecto, incluyendo sus componentes principales, responsabilidades, flujos de comunicación y decisiones base de implementación.

La arquitectura está diseñada para una primera versión simple, de bajo costo y fácil mantenimiento, orientada a un sitio público de contenido con un único administrador.

## 2. Objetivos de la arquitectura
La arquitectura debe cumplir con los siguientes objetivos:

- permitir publicar contenido de forma sencilla
- separar claramente sitio público y panel administrativo
- mantener bajo el costo operativo inicial
- reducir complejidad innecesaria en v1
- facilitar mantenimiento por una sola persona
- permitir escalar el proyecto de forma controlada en futuras versiones

## 3. Stack principal
- **Frontend / Web app:** Astro
- **Lenguaje principal:** TypeScript
- Validación de formularios: Zod
- **Autenticación:** Supabase Auth
- **Base de datos:** Supabase Postgres
- **Almacenamiento de imágenes:** Supabase Storage
- **Hosting / Runtime:** Cloudflare Workers

## 4. Enfoque arquitectónico
La aplicación seguirá una arquitectura simple de tipo **monolito web ligero**, donde el sitio público y el panel administrativo vivirán dentro del mismo proyecto Astro.

No se utilizarán microservicios ni proyectos separados para frontend y backend en la versión inicial.

### Razón de esta decisión
Separar frontend, backend y panel administrativo en aplicaciones distintas aumentaría el costo de mantenimiento, la complejidad operativa y el tiempo de desarrollo sin aportar valor real para una v1 con un solo administrador.

## 5. Componentes principales

### 5.1 Sitio público
Responsable de mostrar el contenido visible para cualquier visitante.

Funciones:
- mostrar la landing principal
- listar publicaciones publicadas
- mostrar detalle de publicación
- exponer navegación pública sin login

### 5.2 Panel administrativo
Responsable de permitir la administración del contenido por parte del único usuario autorizado.

Funciones:
- login del administrador
- listado de publicaciones
- creación de publicaciones
- edición de publicaciones
- cambio de estado (`draft`, `published`, `archived`)
- futura gestión básica de imágenes

### 5.3 Supabase Auth
Responsable de la autenticación del administrador.

Funciones:
- login
- manejo de sesión
- almacenamiento seguro de credenciales
- cambio de contraseña

### 5.4 Supabase Postgres
Responsable de almacenar la información estructurada del sistema.

Funciones:
- almacenar el registro del administrador autorizado
- almacenar publicaciones
- aplicar restricciones de integridad
- soportar políticas de acceso con RLS

### 5.5 Supabase Storage
Responsable de almacenar archivos de imagen asociados a las publicaciones.

Funciones:
- almacenar imágenes destacadas
- permitir recuperar imágenes para mostrarlas públicamente
- centralizar archivos relacionados al contenido

### 5.6 Cloudflare Workers
Responsable del hosting y ejecución del proyecto en producción.

Funciones:
- servir el sitio público
- ejecutar rutas protegidas del panel
- proporcionar un entorno de despliegue de bajo costo

## 6. Distribución de responsabilidades

### Astro
- estructura de páginas
- renderizado del sitio
- layouts
- componentes de UI
- páginas públicas
- páginas privadas del panel administrativo
- integración con Supabase
- protección de rutas administrativas mediante middleware o validación del lado servidor

### Supabase Auth
- identidad del administrador
- gestión de contraseña
- gestión de sesión

### Supabase Database
- persistencia del contenido
- validaciones estructurales
- restricciones de estado y tipo
- relaciones entre entidades

### Supabase Storage
- archivos multimedia de publicaciones

### Cloudflare
- despliegue
- ejecución del proyecto en producción

## 7. Flujo general del sistema

### 7.1 Flujo público
1. Un visitante entra al sitio público.
2. El sistema consulta las publicaciones con estado `published`.
3. El visitante puede ver el listado de publicaciones.
4. El visitante puede abrir una publicación individual mediante su `slug`.

### 7.2 Flujo administrativo
1. El administrador accede a una pantalla de login separada del sitio público.
2. El sistema autentica al usuario mediante Supabase Auth.
3. Una vez autenticado, el administrador puede acceder al panel privado.
4. Desde el panel puede crear, editar, archivar o publicar publicaciones.
5. Cuando una publicación cambia a `published`, esta se vuelve visible en el sitio público.
6. La fecha de publicación se asigna automáticamente en el momento de publicación.

## 8. Modelo de acceso

### Público
- acceso libre al sitio web
- solo puede consultar publicaciones publicadas
- no puede autenticarse ni modificar contenido

### Administrador
- acceso restringido mediante login
- único usuario autorizado
- puede administrar publicaciones dentro del panel privado

## 9. Rutas principales esperadas

### Públicas
- `/`
- `/posts`
- `/posts/[slug]`

### Privadas
- `/admin/login`
- `/admin`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/[id]/edit`

## 10. Estrategia de renderizado
La arquitectura utilizará un enfoque híbrido:

- páginas públicas generales pueden renderizarse de forma eficiente para lectura
- las páginas del panel administrativo requerirán validación de sesión
- el contenido visible al público dependerá del estado almacenado en base de datos

La estrategia exacta de renderizado podrá ajustarse durante la implementación según necesidades del despliegue.

## 11. Estrategia de seguridad
- el panel administrativo estará separado del sitio público
- el acceso al panel requerirá autenticación
- las credenciales no se almacenarán en tablas propias del proyecto
- la autorización del administrador se apoyará en Supabase Auth y la tabla `admin_users`
- las tablas públicas del sistema utilizarán Row Level Security
- el contenido público solo podrá consultarse cuando esté en estado `published`

## 12. Estrategia de almacenamiento de contenido
El contenido editorial se almacenará en la base de datos mediante la entidad `posts`.

Cada publicación incluirá:
- contenido principal
- estado
- tipo de publicación
- slug
- metadatos básicos
- referencia opcional a imagen destacada

Las imágenes asociadas se almacenarán fuera de la tabla, en Storage.

## 13. Estrategia de despliegue
Durante desarrollo:
- Astro correrá en local
- Supabase correrá localmente mediante CLI y Docker

En producción:
- la aplicación se desplegará en Cloudflare Workers
- la base de datos y autenticación estarán en Supabase del cliente
- el almacenamiento de imágenes estará en Supabase Storage del cliente

## 14. Decisiones arquitectónicas iniciales
- Se utilizará un solo proyecto Astro para sitio público y panel administrativo.
- Se usará Supabase Auth en lugar de autenticación construida manualmente.
- Se usará una sola entidad `posts` en lugar de tablas separadas para blog, noticias y consejos.
- No se permitirán múltiples administradores en v1.
- No se permitirá eliminación física de publicaciones en v1; se utilizará el estado `archived`.

## 15. Limitaciones de la versión inicial
La arquitectura de v1 no contempla:
- múltiples roles administrativos
- comentarios
- suscripciones
- editor visual avanzado
- búsqueda avanzada
- analítica avanzada
- flujos editoriales complejos

## 16. Riesgos o decisiones pendientes
- definir si las imágenes destacadas serán obligatorias o opcionales
- definir si el contenido se almacenará como Markdown simple o texto enriquecido
- definir si habrá páginas complementarias como `about` o `contact`
- definir el manejo futuro de SEO avanzado