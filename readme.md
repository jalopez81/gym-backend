# Resumen del Proyecto - Backend Gimnasio

## Stack Tecnológico
- Node.js + Express.js + TypeScript
- PostgreSQL con Prisma ORM
- Zod para validación
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- Winston para logging

## Estructura del Proyecto
- `src/index.ts` - Servidor principal
- `src/config/logger.ts` - Configuración de Winston
- `src/modelos/prisma.ts` - Cliente de Prisma
- `src/utilidades/jwt.ts` - Generación y verificación de tokens
- `src/utilidades/hash.ts` - Encriptación de contraseñas
- `src/middlewares/auth.middleware.ts` - Middleware de autenticación y autorización
- `src/middlewares/error.middleware.ts` - Middleware de manejo de errores centralizado
- `src/validadores/usuario.validador.ts` - Esquemas de validación con Zod (usuarios)
- `src/validadores/usuario.actualizar.validador.ts` - Esquemas de validación para actualizar usuarios
- `src/validadores/producto.validador.ts` - Esquemas de validación con Zod (productos)
- `src/validadores/entrenador.validador.ts` - Esquemas de validación con Zod (entrenadores)
- `src/validadores/clase.validador.ts` - Esquemas de validación con Zod (clases)
- `src/validadores/sesion.validador.ts` - Esquemas de validación con Zod (sesiones)
- `src/validadores/reserva.validador.ts` - Esquemas de validación con Zod (reservas)
- `src/validadores/plan.validador.ts` - Esquemas de validación con Zod (planes)
- `src/validadores/suscripcion.validador.ts` - Esquemas de validación con Zod (suscripciones)
- `src/servicios/auth.servicio.ts` - Lógica de negocio de autenticación
- `src/servicios/producto.servicio.ts` - Lógica de negocio de productos (CRUD + filtros)
- `src/servicios/usuario.servicio.ts` - Lógica de negocio de usuarios (CRUD)
- `src/servicios/entrenador.servicio.ts` - Lógica de negocio de entrenadores (CRUD + asignaciones)
- `src/servicios/clase.servicio.ts` - Lógica de negocio de clases (CRUD)
- `src/servicios/sesion.servicio.ts` - Lógica de negocio de sesiones (CRUD)
- `src/servicios/reserva.servicio.ts` - Lógica de negocio de reservas (CRUD + validaciones)
- `src/servicios/plan.servicio.ts` - Lógica de negocio de planes (CRUD)
- `src/servicios/suscripcion.servicio.ts` - Lógica de negocio de suscripciones (CRUD + renovación)
- `src/controladores/auth.controlador.ts` - Manejo de peticiones HTTP (auth)
- `src/controladores/producto.controlador.ts` - Manejo de peticiones HTTP (productos)
- `src/controladores/usuario.controlador.ts` - Manejo de peticiones HTTP (usuarios)
- `src/controladores/entrenador.controlador.ts` - Manejo de peticiones HTTP (entrenadores)
- `src/controladores/clase.controlador.ts` - Manejo de peticiones HTTP (clases)
- `src/controladores/sesion.controlador.ts` - Manejo de peticiones HTTP (sesiones)
- `src/controladores/reserva.controlador.ts` - Manejo de peticiones HTTP (reservas)
- `src/controladores/plan.controlador.ts` - Manejo de peticiones HTTP (planes)
- `src/controladores/suscripcion.controlador.ts` - Manejo de peticiones HTTP (suscripciones)
- `src/rutas/auth.rutas.ts` - Definición de endpoints (auth)
- `src/rutas/producto.rutas.ts` - Definición de endpoints (productos con protección)
- `src/rutas/usuario.rutas.ts` - Definición de endpoints (usuarios con protección)
- `src/rutas/entrenador.rutas.ts` - Definición de endpoints (entrenadores con protección)
- `src/rutas/clase.rutas.ts` - Definición de endpoints (clases con protección)
- `src/rutas/sesion.rutas.ts` - Definición de endpoints (sesiones con protección)
- `src/rutas/reserva.rutas.ts` - Definición de endpoints (reservas con protección)
- `src/rutas/plan.rutas.ts` - Definición de endpoints (planes con protección)
- `src/rutas/suscripcion.rutas.ts` - Definición de endpoints (suscripciones con protección)

## Base de Datos (Prisma Schema)
- Modelo `Usuario`: id, email, nombre, password, rol, creado
- Modelo `Producto`: id, nombre, descripcion, precio, stock, categoria, creado
- Modelo `Entrenador`: id, usuarioId, especialidad, experiencia, certificaciones, creado
- Modelo `AsignacionEntrenador`: id, clienteId, entrenadorId, fechaAsignacion, activo (relación muchos-a-muchos)
- Modelo `Clase`: id, nombre, descripcion, duracion, capacidad, entrenadorId, creado
- Modelo `Sesion`: id, claseId, fechaHora, creado
- Modelo `Reserva`: id, clienteId, sesionId, estado, creado
- Modelo `Plan`: id, nombre, descripcion, precio, duracionDias, beneficios, creado
- Modelo `Suscripcion`: id, usuarioId, planId, fechaInicio, fechaVencimiento, estado, creado

## Variables de Entorno (.env)
- `PORT=5000`
- `DATABASE_URL=postgresql://postgres:password@localhost:5432/gym_db`
- `JWT_SECRET=mi-secreto-super-seguro-2024`

## Endpoints Disponibles

### Autenticación (Públicos)
- `GET /` - Ruta de prueba
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/productos` - Listar todos los productos (público) - Con paginación, búsqueda, filtros y ordenamiento
- `GET /api/productos/:id` - Obtener producto por ID (público)
- `POST /api/productos` - Crear producto (requiere: autenticación + rol admin)
- `PUT /api/productos/:id` - Actualizar producto (requiere: autenticación + rol admin)
- `DELETE /api/productos/:id` - Eliminar producto (requiere: autenticación + rol admin)

### Usuarios
- `GET /api/usuarios/perfil` - Obtener mi perfil (requiere: autenticación)
- `PUT /api/usuarios/perfil` - Actualizar mi perfil (requiere: autenticación)
- `POST /api/usuarios/cambiar-contraseña` - Cambiar mi contraseña (requiere: autenticación)
- `GET /api/usuarios` - Listar todos los usuarios (requiere: autenticación + rol admin)

### Entrenadores
- `GET /api/entrenadores` - Listar todos los entrenadores (público)
- `GET /api/entrenadores/:id` - Obtener entrenador por ID (público)
- `POST /api/entrenadores` - Crear entrenador (requiere: autenticación + rol admin)
- `PUT /api/entrenadores/:id` - Actualizar entrenador (requiere: autenticación + rol admin)
- `DELETE /api/entrenadores/:id` - Eliminar entrenador (requiere: autenticación + rol admin)
- `POST /api/entrenadores/asignar/cliente` - Asignar cliente a entrenador (requiere: autenticación + rol admin)
- `POST /api/entrenadores/desasignar/cliente` - Desasignar cliente de entrenador (requiere: autenticación + rol admin)

### Clases
- `GET /api/clases` - Listar todas las clases (público)
- `GET /api/clases/:id` - Obtener clase por ID (público)
- `POST /api/clases` - Crear clase (requiere: autenticación + rol admin)
- `PUT /api/clases/:id` - Actualizar clase (requiere: autenticación + rol admin)
- `DELETE /api/clases/:id` - Eliminar clase (requiere: autenticación + rol admin)

### Sesiones
- `GET /api/sesiones` - Listar todas las sesiones (público)
- `GET /api/sesiones/:id` - Obtener sesión por ID (público)
- `GET /api/sesiones/clase/:claseId` - Obtener sesiones por clase (público)
- `POST /api/sesiones` - Crear sesión (requiere: autenticación + rol admin)
- `PUT /api/sesiones/:id` - Actualizar sesión (requiere: autenticación + rol admin)
- `DELETE /api/sesiones/:id` - Eliminar sesión (requiere: autenticación + rol admin)

### Reservas
- `POST /api/reservas` - Crear reserva (requiere: autenticación)
- `GET /api/reservas` - Obtener mis reservas (requiere: autenticación)
- `GET /api/reservas/sesion/:sesionId` - Obtener reservas de una sesión (público)
- `DELETE /api/reservas/:id` - Cancelar reserva (requiere: autenticación)
- `GET /api/reservas/admin/todas` - Listar todas las reservas (requiere: autenticación + rol admin)

### Planes
- `GET /api/planes` - Listar todos los planes (público)
- `GET /api/planes/:id` - Obtener plan por ID (público)
- `POST /api/planes` - Crear plan (requiere: autenticación + rol admin)
- `PUT /api/planes/:id` - Actualizar plan (requiere: autenticación + rol admin)
- `DELETE /api/planes/:id` - Eliminar plan (requiere: autenticación + rol admin)

### Suscripciones
- `POST /api/suscripciones` - Crear suscripción (requiere: autenticación)
- `GET /api/suscripciones/mi-suscripcion` - Obtener mi suscripción (requiere: autenticación)
- `DELETE /api/suscripciones/:id` - Cancelar suscripción (requiere: autenticación)
- `POST /api/suscripciones/:id/renovar` - Renovar suscripción (requiere: autenticación)
- `GET /api/suscripciones` - Listar todas las suscripciones (requiere: autenticación + rol admin)

## Scripts NPM
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar versión compilada

## Funcionalidades Implementadas
- ✅ Servidor Express con TypeScript
- ✅ Conexión a PostgreSQL con Prisma
- ✅ Logging con Winston (consola y archivos)
- ✅ Validación de datos con Zod
- ✅ Autenticación con JWT
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Sistema de registro de usuarios
- ✅ Sistema de login
- ✅ Middleware de autenticación (verificación de token)
- ✅ Middleware de autorización (verificación de roles)
- ✅ Servicio completo de productos (CRUD)
- ✅ Controlador de productos con validaciones
- ✅ Controlador de usuarios con validaciones
- ✅ Rutas de productos protegidas por roles
- ✅ Rutas de usuarios protegidas por autenticación
- ✅ Sistema completo de permisos (admin vs cliente)
- ✅ Paginación, búsqueda y filtros de productos
- ✅ Gestión de perfiles de usuarios
- ✅ Cambio de contraseña seguro
- ✅ Manejo centralizado de errores
- ✅ Validaciones robustas con Zod
- ✅ Respuestas consistentes en toda la API
- ✅ Módulo de Entrenadores (CRUD completo)
- ✅ Sistema de asignación de clientes a entrenadores (muchos-a-muchos)
- ✅ Generador de datos de ejemplo en línea de comandos
- ✅ Módulo de Clases (CRUD completo)
- ✅ Módulo de Sesiones (CRUD + asociación a clases)
- ✅ Módulo de Reservas (CRUD + validaciones de capacidad y conflictos)
- ✅ Sistema de reservas con validación de horarios
- ✅ Control de capacidad en clases

## Módulos Completados
- ✅ Autenticación y Autorización
- ✅ Gestión de Usuarios
- ✅ Gestión de Productos
- ✅ Gestión de Entrenadores
- ✅ Gestión de Clases
- ✅ Gestión de Sesiones
- ✅ Sistema de Reservas
- ✅ Sistema de Planes de Suscripción

## Próximos Pasos
- Agregar más módulos: Ventas, Pagos (simulados), Asistencia
- Implementar sistema de notificaciones por email
- Crear reportes exportables (Excel/PDF)
- Sistema de backups automáticos
- Comenzar con el frontend (Next.js)