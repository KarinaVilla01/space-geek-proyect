# PRD - Product Requirements Document

## 1. Propósito del producto
Desarrollar un sitio web público orientado a la publicación de contenido, donde un único administrador pueda iniciar sesión en un panel privado para crear, editar, guardar y publicar entradas visibles para los visitantes del sitio.

## 2. Objetivo principal
Permitir que el cliente administre su propio contenido de forma autónoma desde una interfaz privada, sin necesidad de modificar código manualmente para cada nueva publicación.

## 3. Usuarios

### 3.1 Administrador
Usuario único con acceso al panel privado del sistema.

Responsabilidades:
- iniciar sesión
- crear publicaciones
- editar publicaciones
- guardar borradores
- publicar contenido
- cambiar su contraseña
- gestionar imagen destacada de las publicaciones

### 3.2 Visitante público
Usuario sin cuenta y sin acceso administrativo.

Acciones permitidas:
- navegar por el sitio
- ver publicaciones publicadas
- abrir el detalle de una publicación

## 4. Historias de usuario

### 4.1 Historias del administrador
- Como administrador, quiero iniciar sesión para acceder al panel privado.
- Como administrador, quiero crear una publicación con título, contenido e imagen.
- Como administrador, quiero guardar una publicación como borrador.
- Como administrador, quiero editar una publicación existente.
- Como administrador, quiero publicar una entrada para que sea visible en el sitio público.
- Como administrador, quiero cambiar mi contraseña para mantener mi acceso seguro.

### 4.2 Historias del visitante
- Como visitante, quiero ver una lista de publicaciones disponibles.
- Como visitante, quiero abrir una publicación individual para leer su contenido.
- Como visitante, quiero navegar el sitio sin necesidad de iniciar sesión.

## 5. Requisitos funcionales

### 5.1 Autenticación
- El sistema debe contar con una pantalla de login independiente del sitio público.
- El sistema debe permitir acceso únicamente al administrador autorizado.
- El sistema no debe permitir registro público de usuarios.
- La autenticación del administrador será gestionada mediante Supabase Auth.
- El sistema debe permitir al administrador cambiar su contraseña.

### 5.2 Gestión de publicaciones
- El sistema debe permitir crear publicaciones.
- El sistema debe permitir editar publicaciones existentes.
- El sistema debe permitir guardar publicaciones en estado borrador.
- El sistema debe permitir publicar publicaciones.
- El sistema debe permitir archivar publicaciones sin eliminarlas físicamente.
- El sistema debe permitir asignar un tipo de publicación.
- El sistema debe generar o almacenar un slug único para cada publicación.

### 5.3 Contenido de publicación
Cada publicación deberá permitir capturar al menos:
- título
- slug
- extracto o resumen
- contenido principal
- imagen destacada
- estado
- tipo de publicación
- fecha de publicación

### 5.4 Sitio público
- El sistema debe mostrar únicamente publicaciones con estado `published`.
- El sistema debe contar con una página de listado de publicaciones.
- El sistema debe contar con una página individual para cada publicación.
- El visitante no debe poder acceder al panel administrativo.

### 5.5 Administración
- El sistema debe contar con una sección privada para listar publicaciones existentes.
- El sistema debe mostrar el estado de cada publicación dentro del panel.
- El sistema debe permitir editar una publicación desde el listado administrativo.

## 6. Requisitos no funcionales
- El sistema debe ser responsive para escritorio y móvil.
- El sistema debe tener buen rendimiento de carga.
- El sistema debe ser de bajo costo de operación.
- El sistema debe ser fácil de mantener.
- El sistema debe estar preparado para despliegue en producción.
- El sistema debe manejar autenticación de forma segura.

## 7. Reglas de negocio
- Solo existirá una cuenta administrativa activa en la versión inicial.
- No existirá registro público de usuarios.
- Una publicación en estado `draft` no debe ser visible en el sitio público.
- Una publicación en estado `archived` no debe ser visible en el sitio público.
- Solo una publicación en estado `published` debe mostrarse públicamente.
- Cada publicación debe tener un slug único.
- El acceso al panel administrativo solo será posible después de autenticación válida.
- La fecha de publicación debe generarse automáticamente cuando una publicación cambie al estado `published`.
- Los tipos de publicación permitidos en la versión inicial serán `blog`, `news` y `tip`.

## 8. Criterios de aceptación

### 8.1 Login de administrador
- Dado que el administrador accede a la pantalla de login,
- cuando ingresa credenciales válidas,
- entonces debe acceder al panel administrativo.

- Dado que un visitante intenta acceder a una ruta privada sin autenticarse,
- entonces el sistema debe redirigirlo o bloquear el acceso.

### 8.2 Crear publicación
- Dado que el administrador está autenticado,
- cuando crea una publicación con los campos requeridos,
- entonces el sistema debe guardarla correctamente.

### 8.3 Guardar borrador
- Dado que el administrador crea una publicación,
- cuando la guarda como borrador,
- entonces la publicación no debe aparecer en el sitio público.

### 8.4 Publicar entrada
- Dado que el administrador tiene una publicación guardada,
- cuando cambia su estado a `published`,
- entonces la publicación debe aparecer en el listado público.
- Y el sistema debe asignar automáticamente la fecha de publicación.

### 8.5 Archivar publicación
- Dado que existe una publicación publicada o previamente creada,
- cuando el administrador cambia su estado a `archived`,
- entonces la publicación no debe aparecer en el sitio público.
- Y la publicación debe conservarse en el panel administrativo.

### 8.6 Visibilidad pública
- Dado que un visitante accede al sitio,
- cuando navega al listado de publicaciones,
- entonces solo debe ver publicaciones publicadas.

## 9. Fuera de alcance
La versión inicial no incluirá:
- múltiples administradores
- roles avanzados
- comentarios
- registro de usuarios públicos
- likes o reacciones
- suscripciones o membresías
- newsletter
- analítica avanzada
- programación automática de publicaciones
- editor visual complejo tipo WordPress o Notion
- búsqueda avanzada

## 10. Riesgos o preguntas abiertas
- Definir si la imagen destacada será obligatoria o opcional.
- Definir si el contenido se capturará como texto enriquecido o Markdown.
- Definir si habrá categorías y tags en la versión inicial o solo tipo de publicación.
- Definir si existirán páginas adicionales como “Acerca de” o “Contacto” en la versión inicial.