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
- `src/config/mailer.ts` - Configuración de Nodemailer para envío de emails
- `src/modelos/prisma.ts` - Cliente de Prisma
- `src/utilidades/jwt.ts` - Generación y verificación de tokens
- `src/utilidades/hash.ts` - Encriptación de contraseñas
- `src/utilidades/generador.ts` - Generador de datos de ejemplo
- `src/utilidades/emailTemplates.ts` - Templates HTML profesionales para emails
- `src/utilidades/generador.ts` - Generador de datos de ejemplo
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
- `src/validadores/asistencia.validador.ts` - Esquemas de validación con Zod (asistencia)
- `src/validadores/carrito.validador.ts` - Esquemas de validación con Zod (carrito)
- `src/validadores/orden.validador.ts` - Esquemas de validación con Zod (órdenes)
- `src/servicios/auth.servicio.ts` - Lógica de negocio de autenticación
- `src/servicios/producto.servicio.ts` - Lógica de negocio de productos (CRUD + filtros)
- `src/servicios/usuario.servicio.ts` - Lógica de negocio de usuarios (CRUD)
- `src/servicios/entrenador.servicio.ts` - Lógica de negocio de entrenadores (CRUD + asignaciones)
- `src/servicios/clase.servicio.ts` - Lógica de negocio de clases (CRUD)
- `src/servicios/sesion.servicio.ts` - Lógica de negocio de sesiones (CRUD)
- `src/servicios/reserva.servicio.ts` - Lógica de negocio de reservas (CRUD + validaciones)
- `src/servicios/plan.servicio.ts` - Lógica de negocio de planes (CRUD)
- `src/servicios/suscripcion.servicio.ts` - Lógica de negocio de suscripciones (CRUD + renovación)
- `src/servicios/asistencia.servicio.ts` - Lógica de negocio de asistencia (CRUD + estadísticas)
- `src/servicios/carrito.servicio.ts` - Lógica de negocio de carrito (CRUD)
- `src/servicios/orden.servicio.ts` - Lógica de negocio de órdenes (CRUD + completar)
- `src/servicios/reporte.servicio.ts` - Lógica de negocio de reportes (generación Excel)
- `src/controladores/auth.controlador.ts` - Manejo de peticiones HTTP (auth)
- `src/controladores/producto.controlador.ts` - Manejo de peticiones HTTP (productos)
- `src/controladores/usuario.controlador.ts` - Manejo de peticiones HTTP (usuarios)
- `src/controladores/entrenador.controlador.ts` - Manejo de peticiones HTTP (entrenadores)
- `src/controladores/clase.controlador.ts` - Manejo de peticiones HTTP (clases)
- `src/controladores/sesion.controlador.ts` - Manejo de peticiones HTTP (sesiones)
- `src/controladores/reserva.controlador.ts` - Manejo de peticiones HTTP (reservas)
- `src/controladores/plan.controlador.ts` - Manejo de peticiones HTTP (planes)
- `src/controladores/suscripcion.controlador.ts` - Manejo de peticiones HTTP (suscripciones)
- `src/controladores/asistencia.controlador.ts` - Manejo de peticiones HTTP (asistencia)
- `src/controladores/carrito.controlador.ts` - Manejo de peticiones HTTP (carrito)
- `src/controladores/orden.controlador.ts` - Manejo de peticiones HTTP (órdenes)
- `src/controladores/reporte.controlador.ts` - Manejo de peticiones HTTP (reportes)
- `src/rutas/auth.rutas.ts` - Definición de endpoints (auth)
- `src/rutas/producto.rutas.ts` - Definición de endpoints (productos con protección)
- `src/rutas/usuario.rutas.ts` - Definición de endpoints (usuarios con protección)
- `src/rutas/entrenador.rutas.ts` - Definición de endpoints (entrenadores con protección)
- `src/rutas/clase.rutas.ts` - Definición de endpoints (clases con protección)
- `src/rutas/sesion.rutas.ts` - Definición de endpoints (sesiones con protección)
- `src/rutas/reserva.rutas.ts` - Definición de endpoints (reservas con protección)
- `src/rutas/plan.rutas.ts` - Definición de endpoints (planes con protección)
- `src/rutas/suscripcion.rutas.ts` - Definición de endpoints (suscripciones con protección)
- `src/rutas/asistencia.rutas.ts` - Definición de endpoints (asistencia con protección)
- `src/rutas/carrito.rutas.ts` - Definición de endpoints (carrito con protección)
- `src/rutas/orden.rutas.ts` - Definición de endpoints (órdenes con protección)
- `src/rutas/reporte.rutas.ts` - Definición de endpoints (reportes con protección admin)

## Base de Datos (Prisma Schema)
- Modelo `Usuario`: id, email, nombre, password, rol, creado
- Modelo `Producto`: id, nombre, descripcion, precio, stock, categoria, creado
- Modelo `Entrenador`: id, usuarioId, especialidad, experiencia, certificaciones, creado
- Modelo `AsignacionEntrenador`: id, clienteId, entrenadorId, fechaAsignacion, activo
- Modelo `Clase`: id, nombre, descripcion, duracion, capacidad, entrenadorId, creado
- Modelo `Sesion`: id, claseId, fechaHora, creado
- Modelo `Reserva`: id, clienteId, sesionId, estado, creado
- Modelo `Plan`: id, nombre, descripcion, precio, duracionDias, beneficios, creado
- Modelo `Suscripcion`: id, usuarioId, planId, fechaInicio, fechaVencimiento, estado, creado
- Modelo `Asistencia`: id, sesionId, clienteId, estado, horaEntrada, creado
- Modelo `CarritoItem`: id, usuarioId, productoId, cantidad, creado
- Modelo `Orden`: id, usuarioId, total, estado, creado
- Modelo `OrdenItem`: id, ordenId, productoId, cantidad, precioUnitario, subtotal

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

### Asistencia
- `POST /api/asistencia` - Marcar asistencia (requiere: autenticación)
- `GET /api/asistencia/sesion/:sesionId` - Obtener asistencias de sesión (público)
- `GET /api/asistencia/mi-historial` - Obtener mi historial (requiere: autenticación)
- `GET /api/asistencia/estadisticas/:clienteId` - Obtener estadísticas (requiere: autenticación)
- `GET /api/asistencia` - Listar todas (requiere: autenticación + rol admin)

### Carrito
- `POST /api/carrito` - Agregar producto (requiere: autenticación)
- `GET /api/carrito` - Obtener mi carrito (requiere: autenticación)
- `PUT /api/carrito/:productoId` - Actualizar cantidad (requiere: autenticación)
- `DELETE /api/carrito/:productoId` - Eliminar producto (requiere: autenticación)
- `DELETE /api/carrito` - Vaciar carrito (requiere: autenticación)

### Órdenes
- `POST /api/ordenes` - Crear orden (requiere: autenticación)
- `GET /api/ordenes/mis-ordenes` - Obtener mis órdenes (requiere: autenticación)
- `GET /api/ordenes/:id` - Obtener detalle de orden (requiere: autenticación)
- `POST /api/ordenes/:id/completar` - Completar orden/pago simulado (requiere: autenticación)
- `POST /api/ordenes/:id/cancelar` - Cancelar orden (requiere: autenticación)
- `GET /api/ordenes` - Listar todas (requiere: autenticación + rol admin)

### Reportes (Solo Admin)
- `GET /api/reportes/usuarios` - Descargar reporte de usuarios (Excel)
- `GET /api/reportes/productos` - Descargar reporte de productos (Excel)
- `GET /api/reportes/ordenes` - Descargar reporte de órdenes (Excel)
- `GET /api/reportes/ordenes?estado=completada` - Reporte de órdenes completadas
- `GET /api/reportes/ordenes?estado=pendiente` - Reporte de órdenes pendientes
- `GET /api/reportes/suscripciones` - Descargar reporte de suscripciones (Excel)
- `GET /api/reportes/suscripciones?estado=activa` - Reporte de suscripciones activas
- `GET /api/reportes/suscripciones?estado=vencida` - Reporte de suscripciones vencidas
- `GET /api/reportes/asistencia` - Descargar reporte de asistencia (Excel)
- `GET /api/reportes/asistencia?claseId={ID}` - Reporte de asistencia por clase

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
- ✅ Sistema de Asistencia
- ✅ Sistema de Carrito y Órdenes
- ✅ Reportes Exportables

## Próximos Pasos
- Agregar módulo de Asistencia
- Agregar módulo de Ventas y Pagos (simulados)
- Implementar sistema de notificaciones por email
- Crear reportes exportables (Excel/PDF)
- Sistema de backups automáticos
- Comenzar con el frontend (Next.js)

## Estado Actual
✅ **Backend completamente funcional** con 9 módulos implementados
✅ Todos los endpoints testeados en Postman
✅ Sistema de autenticación y autorización por roles
✅ Validaciones robustas con Zod
✅ Logging completo con Winston
✅ Manejo centralizado de errores
✅ Generador de datos de ejemplo