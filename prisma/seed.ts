import { PrismaClient } from '@prisma/client';
import { generarHash } from '../src/utils/hash';
import { ROLES } from '../src/middlewares/auth.middleware';
import logger from '../src/config/logger';

import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();


interface DatosEjemplo {
  usuariosCreados: number;
  productosCreados: number;
  entrenadoresCreados: number;
  planesCreados: number;
  clasesCreadas: number;
  sesionesCreadas: number;
  ordenesCreadas: number;
}

export const generarDatosEjemplo = async () => {
  const resultado: DatosEjemplo = {
    usuariosCreados: 0,
    productosCreados: 0,
    entrenadoresCreados: 0,
    planesCreados: 0,
    clasesCreadas: 0,
    sesionesCreadas: 0,
    ordenesCreadas: 0,
  };

  try {
    logger.info('Iniciando limpieza de base de datos...');

    // Borrado en orden jerárquico para evitar errores de FK
    const deleteOps = [
      prisma.ordenItem.deleteMany(),
      prisma.orden.deleteMany(),
      prisma.carritoItem.deleteMany(),
      prisma.asistencia.deleteMany(),
      prisma.reserva.deleteMany(),
      prisma.sesion.deleteMany(),
      prisma.clase.deleteMany(),
      prisma.asignacionEntrenador.deleteMany(),
      prisma.entrenador.deleteMany(),
      prisma.suscripcion.deleteMany(),
      prisma.plan.deleteMany(),
      prisma.producto.deleteMany(),
      prisma.usuario.deleteMany(),
      prisma.configuracion.deleteMany(),
    ];
    await prisma.$transaction(deleteOps);

    logger.info('Insertando datos base...');

    const passwordHash = await generarHash('123456');

    // 1. Usuarios (Usando transacción para asegurar la creación)
    const usuariosData = [
      { email: "admin@gym.com", nombre: "Administrador", password: passwordHash, rol: ROLES.ADMIN, status: 'activo' },
      { email: "carlos@gym.com", nombre: "Carlos García", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo' },
      { email: "julio@gym.com", nombre: "Julio Iglesias", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo' },
      { email: "maria@gym.com", nombre: "María López", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo' },
      { email: "juan@gym.com", nombre: "Juan Pérez", password: passwordHash, rol: ROLES.CLIENTE, status: 'activo' },
      { email: "ana@gym.com", nombre: "Ana Martínez", password: passwordHash, rol: ROLES.CLIENTE, status: 'activo' },
      { email: "luis@gym.com", nombre: "Luis Rodríguez", password: passwordHash, rol: ROLES.CLIENTE, status: 'activo' },
      { email: "recepcion@gym.com", nombre: "Recepcionista", password: passwordHash, rol: ROLES.RECEPCIONISTA, status: 'activo' },
    ];

    for (const u of usuariosData) {
      await prisma.usuario.create({ data: u });
      resultado.usuariosCreados++;
    }

    // 2. Entrenadores
    const usuariosEntrenadores = await prisma.usuario.findMany({ where: { rol: ROLES.ENTRENADOR } });
    const especialidades = ["Fuerza", "Cardio", "Yoga", "Pilates"];
    
    for (const user of usuariosEntrenadores) {
      await prisma.entrenador.create({
        data: {
          usuarioId: user.id,
          especialidad: especialidades[Math.floor(Math.random() * especialidades.length)],
          certificaciones: "Certificación Internacional",
          experiencia: 5,
        }
      });
      resultado.entrenadoresCreados++;
    }

    // 3. Productos y Planes
    const productosData = [
            {
                nombre: 'Banco inclinado',
                descripcion: 'Ideal para ejercicios de pecho',
                precio: 615.99,
                stock: 50,
                categoria: 'Accesorios',
                "imagenPublicId": "productos/banco_s8rbc9",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/banco_s8rbc9.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/banco_s8rbc9.jpg",
            },
            {
                nombre: 'Mancuerna',
                descripcion: '50 libras cada una',
                precio: 250.99,
                stock: 100,
                categoria: 'Accesorios',
                "imagenPublicId": "productos/mancuerna_e4yyvq",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/mancuerna_e4yyvq.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/mancuerna_e4yyvq.jpg",
            },
            {
                nombre: 'Faja',
                descripcion: 'Faja Sintetica',
                precio: 45.99,
                stock: 30,
                categoria: 'Accesorios',
                "imagenPublicId": "productos/faja_g0upvr",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/faja_g0upvr.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/faja_g0upvr.jpg",
            },
            {
                nombre: 'Mat Premium',
                descripcion: 'Set de 5 bandas de diferentes resistencias',
                precio: 19.99,
                stock: 40,
                categoria: 'Accesorios',
                "imagenPublicId": "productos/mat_llz20g",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/mat_llz20g.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761669784/mat_llz20g.jpg",
            },
            {
                nombre: 'Productos Gym',
                descripcion: 'Pack de productos variados',
                precio: 29.99,
                stock: 80,
                categoria: 'Ropa',
                "imagenPublicId": "productos/gym-products_f0yvsu",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761544761/gym-products_f0yvsu.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761544761/gym-products_f0yvsu.jpg",
            },
            {
                nombre: 'Protector de rodillas',
                descripcion: 'Protección para entrenamiento intenso',
                precio: 22.99,
                stock: 35,
                categoria: 'Protección',
                "imagenPublicId": "productos/vj7vj28lt1tmdmdo2bqu",
                "imagenUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761543993/productos/vj7vj28lt1tmdmdo2bqu.jpg",
                "imagenSecureUrl": "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761543993/productos/vj7vj28lt1tmdmdo2bqu.jpg",
            },
        ];
    
    await prisma.producto.createMany({ data: productosData });
    resultado.productosCreados = productosData.length;

    const planesData = [
      { nombre: 'Plan Básico', precio: 29.99, duracionDias: 30, nivel: 1 },
      { nombre: 'Plan Premium', precio: 79.99, duracionDias: 30, nivel: 3 },
    ];
    await prisma.plan.createMany({ data: planesData });
    resultado.planesCreados = planesData.length;

    // 4. Clases y Sesiones (Optimizado)
    const entrenadores = await prisma.entrenador.findMany();
    if (entrenadores.length > 0) {
      const claseCreada = await prisma.clase.create({
        data: {
          nombre: 'Yoga Flow',
          descripcion: 'Clase dinámica',
          duracion: 60,
          capacidad: 20,
          entrenadorId: entrenadores[0].id,
          sesiones: {
            create: [
              { fechaHora: new Date(Date.now() + 86400000) }, // Mañana
              { fechaHora: new Date(Date.now() + 172800000) }, // Pasado mañana
            ]
          }
        }
      });
      resultado.clasesCreadas = 1;
      resultado.sesionesCreadas = 2;
    }

    // 5. Órdenes con Nested Writes (Eficiencia máxima)
    const clientes = await prisma.usuario.findMany({ where: { rol: ROLES.CLIENTE } });
    const productosDB = await prisma.producto.findMany();

    if (clientes.length > 0 && productosDB.length > 0) {
      const p = productosDB[0];
      const cantidad = 2;
      
      await prisma.orden.create({
        data: {
          usuarioId: clientes[0].id,
          total: p.precio * cantidad,
          estado: 'COMPLETADA',
          items: {
            create: {
              productoId: p.id,
              cantidad: cantidad,
              precioUnitario: p.precio,
              subtotal: p.precio * cantidad
            }
          }
        }
      });
      resultado.ordenesCreadas = 1;
    }

    logger.info('✅ Seed completado con éxito');
  } catch (err) {
    logger.error('❌ Error en el proceso de seed:', err);
    throw err;
  }

  // Resumen final
  Object.entries(resultado).forEach(([key, val]) => logger.info(`${key}: ${val}`));
};

generarDatosEjemplo()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });