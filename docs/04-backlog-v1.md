# Backlog V1

## 1. Propósito
Este documento organiza el trabajo de la versión inicial del proyecto en tareas ejecutables y ordenadas por prioridad.

El objetivo de este backlog es servir como guía de implementación para construir una primera versión funcional del sistema, enfocada en permitir que un único administrador publique contenido visible en un sitio web público.

## 2. Objetivo de V1
Entregar una versión funcional del sistema que permita:

- autenticación de un solo administrador
- creación de publicaciones
- edición de publicaciones
- cambio de estado entre `draft`, `published` y `archived`
- visualización pública de publicaciones publicadas
- base técnica lista para despliegue futuro

## 3. Fuera de alcance de este backlog
Este backlog no incluye trabajo relacionado con:

- múltiples administradores
- comentarios
- tags y categorías avanzadas
- newsletter
- búsqueda avanzada
- analítica avanzada
- editor visual complejo
- programación automática de publicaciones
- eliminación física de publicaciones

## 4. Criterios de prioridad
Las tareas de este backlog se ordenan según los siguientes criterios:

1. desbloquear trabajo posterior
2. reducir incertidumbre técnica
3. habilitar una funcionalidad usable de extremo a extremo
4. evitar trabajo estético antes de validar el flujo funcional

## 5. Fases del backlog

---

## Fase 1 - Base del proyecto

### 1.1 Estructura inicial del repositorio
- [x] Validar estructura base del proyecto Astro
- [x] Confirmar estructura de carpetas `docs`, `src`, `supabase`
- [x] Crear archivos iniciales de documentación
- [x] Revisar archivo `.env.example`
- [x] Confirmar configuración de Git y primer estado estable del repositorio

### 1.2 Documentación mínima del proyecto
- [x] Completar `00-project-overview.md`
- [x] Completar `01-prd.md`
- [x] Completar `02-data-model.md`
- [x] Completar `03-architecture.md`
- [x] Completar `04-backlog-v1.md`

### 1.3 Entorno local
- [x] Confirmar que Astro corre localmente
- [x] Confirmar que Supabase local corre correctamente
- [x] Verificar acceso a Supabase Studio local
- [x] Confirmar que Docker no presenta bloqueos para desarrollo local

### Resultado esperado de la fase
El proyecto debe quedar documentado, versionado y con entorno local funcional.

---

## Fase 2 - Base de datos y reglas de acceso

### 2.1 Migración inicial
- [x] Crear migración `init_schema`
- [x] Crear tabla `admin_users`
- [x] Crear tabla `posts`
- [x] Agregar restricciones para `status`
- [x] Agregar restricciones para `post_type`
- [x] Agregar restricción de `slug` único

### 2.2 Seguridad y autorización
- [x] Habilitar RLS en tablas necesarias
- [x] Crear policy para lectura pública de posts `published`
- [x] Crear policy para gestión de posts por admin autenticado
- [x] Validar relación entre `auth.users` y `admin_users`

### 2.3 Seed y validación local
- [x] Crear `seed.sql`
- [x] Agregar datos mínimos de prueba
- [x] Ejecutar `supabase db reset`
- [x] Validar tablas y datos en Studio local

### Resultado esperado de la fase
La base de datos local debe quedar operativa, con restricciones, seguridad y datos mínimos de prueba.

---

## Fase 3 - Integración Astro + Supabase

### 3.1 Conexión base
- [x] Crear cliente de Supabase para frontend
- [x] Crear cliente de Supabase para servidor
- [x] Definir manejo de variables de entorno
- [x] Confirmar conexión entre Astro y Supabase local

### 3.2 Tipado y utilidades
- [x] Crear tipos base para `posts`
- [x] Crear utilidades para generación de `slug`
- [x] Instalar Zod para validaciones base
- [x] Crear esquema base de validación para publicaciones
- [x] Crear validaciones base para formularios de publicación

### Resultado esperado de la fase
La aplicación debe poder consultar e interactuar con la base local desde Astro.

---

## Fase 4 - Autenticación del administrador

### 4.1 Flujo de login
- [x] Crear ruta `/admin/login`
- [x] Implementar formulario de login
- [x] Integrar autenticación con Supabase Auth
- [x] Validar acceso con cuenta administrativa

### 4.2 Protección de rutas
- [x] Proteger rutas bajo `/admin`
- [x] Redirigir usuarios no autenticados fuera del panel
- [x] Confirmar que visitantes no puedan acceder al panel privado

### 4.3 Gestión básica de sesión
- [x] Confirmar persistencia de sesión
- [x] Implementar logout
- [x] Validar comportamiento al expirar sesión

### Resultado esperado de la fase
Solo el administrador debe poder entrar al panel privado mediante login válido.

---

## Fase 5 - Panel administrativo base

### 5.1 Dashboard inicial
- [ ] Crear ruta `/admin`
- [ ] Mostrar navegación básica del panel
- [ ] Crear acceso a listado de publicaciones
- [ ] Crear acceso a nueva publicación

### 5.2 Listado administrativo de publicaciones
- [ ] Crear ruta `/admin/posts`
- [ ] Mostrar publicaciones existentes
- [ ] Mostrar `title`, `status`, `post_type`, `created_at`
- [ ] Agregar acceso a edición por publicación

### Resultado esperado de la fase
El administrador debe poder entrar al panel y visualizar la lista de publicaciones.

---

## Fase 6 - Crear publicaciones

### 6.1 Formulario de creación
- [ ] Crear ruta `/admin/posts/new`
- [ ] Implementar formulario para nuevo post
- [ ] Capturar `title`
- [ ] Capturar `slug`
- [ ] Capturar `excerpt`
- [ ] Capturar `content_md`
- [ ] Capturar `post_type`
- [ ] Capturar `status`

### 6.2 Guardado en base de datos
- [ ] Guardar nuevo post como `draft`
- [ ] Validar campos requeridos
- [ ] Validar unicidad de `slug`
- [ ] Confirmar guardado correcto en base de datos

### Resultado esperado de la fase
El administrador debe poder crear publicaciones nuevas y guardarlas como borrador.

---

## Fase 7 - Editar y cambiar estado de publicaciones

### 7.1 Edición de publicación
- [ ] Crear ruta `/admin/posts/[id]/edit`
- [ ] Cargar datos actuales del post
- [ ] Permitir actualizar contenido
- [ ] Permitir actualizar extracto
- [ ] Permitir actualizar tipo de publicación

### 7.2 Cambio de estado
- [ ] Permitir cambio a `draft`
- [ ] Permitir cambio a `published`
- [ ] Permitir cambio a `archived`
- [ ] Asignar `published_at` automáticamente al publicar
- [ ] Confirmar que `published_at` se conserva si luego se archiva

### Resultado esperado de la fase
El administrador debe poder editar publicaciones existentes y controlar su visibilidad mediante el estado.

---

## Fase 8 - Sitio público

### 8.1 Listado de publicaciones públicas
- [ ] Crear ruta `/posts`
- [ ] Consultar solo publicaciones con `status = published`
- [ ] Mostrar lista pública con información básica
- [ ] Confirmar que no aparezcan drafts ni archived

### 8.2 Detalle de publicación
- [ ] Crear ruta `/posts/[slug]`
- [ ] Mostrar contenido completo del post
- [ ] Resolver publicación por `slug`
- [ ] Manejar caso de slug inexistente

### 8.3 Landing principal
- [ ] Definir estructura mínima de `/`
- [ ] Mostrar acceso o vista resumida del contenido publicado
- [ ] Mantener separación clara entre sitio público y admin

### Resultado esperado de la fase
El visitante debe poder navegar publicaciones públicas sin iniciar sesión.

---

## Fase 9 - Imágenes destacadas

### 9.1 Storage
- [ ] Configurar bucket para imágenes
- [ ] Definir convención de nombre o ruta de archivos
- [ ] Validar acceso a imágenes desde el sitio

### 9.2 Integración en publicaciones
- [ ] Permitir subir imagen destacada desde el panel
- [ ] Guardar referencia de imagen en `posts`
- [ ] Mostrar imagen en listado público
- [ ] Mostrar imagen en detalle de publicación

### Resultado esperado de la fase
El administrador debe poder asociar una imagen destacada a cada publicación.

---

## Fase 10 - Validaciones y calidad mínima

### 10.1 Validaciones funcionales
- [ ] Validar que `title` sea obligatorio
- [ ] Validar que `content_md` sea obligatorio al publicar
- [ ] Validar que `slug` sea obligatorio y único
- [ ] Validar que `post_type` esté dentro de valores permitidos
- [ ] Validar que `status` esté dentro de valores permitidos

### 10.2 Experiencia mínima de uso
- [ ] Mostrar mensajes de error comprensibles
- [ ] Mostrar estados de carga básicos
- [ ] Mostrar confirmaciones de guardado

### Resultado esperado de la fase
El sistema debe comportarse de forma consistente y entendible para el administrador.

---

## Fase 11 - Preparación para despliegue

### 11.1 Limpieza técnica
- [ ] Revisar estructura final de carpetas
- [ ] Revisar variables de entorno
- [ ] Revisar uso correcto de claves y secretos
- [ ] Confirmar que no existan datos sensibles hardcodeados

### 11.2 Preparación operativa
- [ ] Definir checklist de despliegue
- [ ] Revisar dependencias del proyecto
- [ ] Confirmar flujo local funcional de extremo a extremo

### Resultado esperado de la fase
El proyecto debe quedar listo para pasar a una etapa posterior de despliegue.

---

## 6. Primeros entregables funcionales esperados

### Entregable 1
- documentación mínima cerrada
- entorno local funcional
- base de datos creada y validada

### Entregable 2
- login administrativo funcional
- panel privado accesible
- listado administrativo de publicaciones

### Entregable 3
- creación, edición y archivado/publicación de posts
- sitio público mostrando publicaciones publicadas

### Entregable 4
- imágenes destacadas
- validaciones mínimas
- base lista para despliegue

## 7. Dependencias clave
- no se puede avanzar con login sin Supabase Auth operativo
- no se puede construir CRUD real sin esquema validado
- no se puede mostrar sitio público real sin flujo de publicación funcionando
- no se debe trabajar en despliegue antes de validar flujo completo local

## 8. Definición de “V1 terminada”
La versión 1 se considerará terminada cuando se cumpla lo siguiente:

- existe una cuenta administrativa funcional
- el administrador puede iniciar sesión
- el administrador puede crear, editar, publicar y archivar publicaciones
- el sitio público muestra únicamente publicaciones publicadas
- el sistema puede ejecutarse de forma estable en entorno local
- la base del proyecto queda lista para una posterior puesta en producción

## Ideas futuras
- categorías
- tags
- SEO avanzado
- buscador
- múltiples administradores