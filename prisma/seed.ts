import { PrismaClient, EstadoSuscripcion } from '@prisma/client';
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
  suscripcionesCreadas: number;
  clasesCreadas: number;
  sesionesCreadas: number;
  reservasCreadas: number;
  asistenciasCreadas: number;
  asignacionesPtCreadas: number;
  ordenesCreadas: number;
}

export const generarDatosEjemplo = async () => {
  const resultado: DatosEjemplo = {
    usuariosCreados: 0,
    productosCreados: 0,
    entrenadoresCreados: 0,
    planesCreados: 0,
    suscripcionesCreadas: 0,
    clasesCreadas: 0,
    sesionesCreadas: 0,
    reservasCreadas: 0,
    asistenciasCreadas: 0,
    asignacionesPtCreadas: 0,
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

    const passwordHash = await generarHash('@dmIn1299');

    // 1. Usuarios (Usando transacción para asegurar la creación)
    const imagenUrls = [
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/entrenador_no_2_s4kbtu.jpg",
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1762266352/trainer_3_ypilrf.jpg",
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/trainerw_so8xhb.jpg",
    ];
    const imagenPublicIds = ["entrenador_no_2_s4kbtu", "trainer_3_ypilrf", "trainerw_so8xhb"];
    const imagenSecureUrls = [
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/entrenador_no_2_s4kbtu.jpg",
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1762266352/trainer_3_ypilrf.jpg",
      "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/trainerw_so8xhb.jpg",
    ];
    const usuariosData = [
      { email: "admin@gym.com", nombre: "Administrador", password: passwordHash, rol: ROLES.ADMIN, status: 'activo' },
      { email: "carlos@gym.com", nombre: "Carlos García", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo', imagenPublicId: imagenPublicIds[0], imagenUrl: imagenUrls[0], imagenSecureUrl: imagenSecureUrls[0] },
      { email: "julio@gym.com", nombre: "Julio Iglesias", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo', imagenPublicId: imagenPublicIds[1], imagenUrl: imagenUrls[1], imagenSecureUrl: imagenSecureUrls[1] },
      { email: "maria@gym.com", nombre: "María López", password: passwordHash, rol: ROLES.ENTRENADOR, status: 'activo', imagenPublicId: imagenPublicIds[2], imagenUrl: imagenUrls[2], imagenSecureUrl: imagenSecureUrls[2] },
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

    // 3. Productos 
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

    // 4. planes 
    const planesData = [
      {
        nombre: 'Plan Básico',
        descripcion: 'Acceso limitado a las instalaciones y clases grupales.',
        precio: 29.99,
        duracionDias: 30,
        beneficios: 'Acceso a gimnasio, 2 clases grupales por semana.',
        nivel: 1,
      },
      {
        nombre: 'Plan Estándar',
        descripcion: 'Acceso completo a las instalaciones y clases grupales.',
        precio: 49.99,
        duracionDias: 30,
        beneficios: 'Acceso a gimnasio, clases grupales ilimitadas, 1 sesión con entrenador personal.',
        nivel: 2,
      },
      {
        nombre: 'Plan Premium',
        descripcion: 'Acceso VIP a todas las instalaciones, clases y servicios adicionales.',
        precio: 79.99,
        duracionDias: 30,
        beneficios: 'Acceso a gimnasio 24/7, clases grupales ilimitadas, 4 sesiones con entrenador personal, acceso a spa y sauna.',
        nivel: 3,
      },
    ];
    await prisma.plan.createMany({ data: planesData });
    resultado.planesCreados = planesData.length;

    const planesDB = await prisma.plan.findMany({ orderBy: { nivel: 'asc' } });
    const clientesSeed = await prisma.usuario.findMany({ where: { rol: ROLES.CLIENTE } });
    const juan = clientesSeed.find((c) => c.email === 'juan@gym.com');
    const ana = clientesSeed.find((c) => c.email === 'ana@gym.com');
    const luis = clientesSeed.find((c) => c.email === 'luis@gym.com');

    if (planesDB.length >= 3 && juan && ana && luis) {
      const finActiva = new Date();
      finActiva.setDate(finActiva.getDate() + 30);
      await prisma.suscripcion.createMany({
        data: [
          {
            usuarioId: juan.id,
            planId: planesDB[0].id,
            fechaVencimiento: finActiva,
            monto: planesDB[0].precio,
            estado: EstadoSuscripcion.ACTIVA,
          },
          {
            usuarioId: ana.id,
            planId: planesDB[1].id,
            fechaVencimiento: finActiva,
            monto: planesDB[1].precio,
            estado: EstadoSuscripcion.ACTIVA,
          },
          {
            usuarioId: luis.id,
            planId: planesDB[2].id,
            fechaVencimiento: finActiva,
            monto: planesDB[2].precio,
            estado: EstadoSuscripcion.ACTIVA,
          },
        ],
      });
      resultado.suscripcionesCreadas += 3;

      const finPasada = new Date();
      finPasada.setDate(finPasada.getDate() - 10);
      await prisma.suscripcion.create({
        data: {
          usuarioId: ana.id,
          planId: planesDB[0].id,
          fechaInicio: new Date(Date.now() - 90 * 86400000),
          fechaVencimiento: finPasada,
          monto: planesDB[0].precio,
          estado: EstadoSuscripcion.CANCELADA,
        },
      });
      resultado.suscripcionesCreadas += 1;
    }

    const entrenadores = await prisma.entrenador.findMany({ orderBy: { creado: 'asc' } });
    if (entrenadores.length > 0) {
      await prisma.clase.create({
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
      resultado.clasesCreadas += 1;
      resultado.sesionesCreadas += 2;
      
      await prisma.clase.create({
        data: {
          nombre: 'CrossFit',
          descripcion: 'Clase de CrossFit',
          duracion: 60,
          capacidad: 20,
          entrenadorId: entrenadores[0].id,
          sesiones: {
            create: [
              { fechaHora: new Date(Date.now() + 86400000) }, 
              { fechaHora: new Date(Date.now() + 172800000) },
              { fechaHora: new Date(Date.now() + 259200000) },
              { fechaHora: new Date(Date.now() + 345600000) },
              { fechaHora: new Date(Date.now() + 432000000) }, 
            ]
          }
        }
      });
      resultado.clasesCreadas += 1;
      resultado.sesionesCreadas += 5;

      await prisma.clase.create({
        data: {
          nombre: 'Pilates',
          descripcion: 'Clase de Pilates',
          duracion: 60,
          capacidad: 20,
          entrenadorId: entrenadores[0].id,
          sesiones: {
            create: [
              { fechaHora: new Date(Date.now() + 86400000) }, 
            ]
          }
        }
      });
      resultado.clasesCreadas += 1;
      resultado.sesionesCreadas += 1;

      await prisma.clase.create({
        data: {
          nombre: 'Spinning',
          descripcion: 'Clase de Spinning',
          duracion: 60,
          capacidad: 20,
          entrenadorId: entrenadores[1].id,
          sesiones: {
            create: [
              { fechaHora: new Date(Date.now() + 86400000) }, 
            ]
          }
        }
      });
      resultado.clasesCreadas += 1;
      resultado.sesionesCreadas += 1;
      
    }

    if (entrenadores.length >= 2 && juan && ana && luis) {
      const asignaciones: { clienteId: string; entrenadorId: string; activo: boolean }[] = [
        { clienteId: juan.id, entrenadorId: entrenadores[0].id, activo: true },
        { clienteId: ana.id, entrenadorId: entrenadores[0].id, activo: true },
        { clienteId: luis.id, entrenadorId: entrenadores[1].id, activo: true },
      ];
      if (entrenadores[2]) {
        asignaciones.push({ clienteId: juan.id, entrenadorId: entrenadores[2].id, activo: true });
      }
      await prisma.asignacionEntrenador.createMany({ data: asignaciones });
      resultado.asignacionesPtCreadas = asignaciones.length;
    }

    const sesionesConClase = await prisma.sesion.findMany({
      include: { clase: true },
      orderBy: [{ claseId: 'asc' }, { fechaHora: 'asc' }],
    });

    if (juan && ana && luis && sesionesConClase.length > 0) {
      const reservasPayload: { clienteId: string; sesionId: string }[] = [];
      const porNombreClase = (nombre: string) =>
        sesionesConClase.filter((s) => s.clase.nombre === nombre);

      for (const s of porNombreClase('CrossFit')) {
        for (const cid of [juan.id, ana.id, luis.id]) {
          reservasPayload.push({ clienteId: cid, sesionId: s.id });
        }
      }
      for (const s of porNombreClase('Yoga Flow')) {
        for (const cid of [juan.id, ana.id, luis.id]) {
          reservasPayload.push({ clienteId: cid, sesionId: s.id });
        }
      }
      for (const s of porNombreClase('Pilates')) {
        for (const cid of [juan.id, ana.id, luis.id]) {
          reservasPayload.push({ clienteId: cid, sesionId: s.id });
        }
      }
      for (const s of porNombreClase('Spinning')) {
        reservasPayload.push({ clienteId: juan.id, sesionId: s.id });
        reservasPayload.push({ clienteId: luis.id, sesionId: s.id });
      }

      await prisma.reserva.createMany({ data: reservasPayload });
      resultado.reservasCreadas = reservasPayload.length;

      const cross = porNombreClase('CrossFit');
      const asistenciasPayload: { sesionId: string; clienteId: string; horaEntrada: Date }[] = [];
      for (const s of cross.slice(0, 4)) {
        asistenciasPayload.push({ sesionId: s.id, clienteId: juan.id, horaEntrada: s.fechaHora });
        asistenciasPayload.push({ sesionId: s.id, clienteId: ana.id, horaEntrada: s.fechaHora });
      }
      if (cross[4]) {
        asistenciasPayload.push({
          sesionId: cross[4].id,
          clienteId: juan.id,
          horaEntrada: cross[4].fechaHora,
        });
      }
      for (const s of porNombreClase('Yoga Flow')) {
        for (const cid of [juan.id, ana.id, luis.id]) {
          asistenciasPayload.push({ sesionId: s.id, clienteId: cid, horaEntrada: s.fechaHora });
        }
      }
      for (const s of porNombreClase('Pilates')) {
        asistenciasPayload.push({ sesionId: s.id, clienteId: juan.id, horaEntrada: s.fechaHora });
        asistenciasPayload.push({ sesionId: s.id, clienteId: ana.id, horaEntrada: s.fechaHora });
      }
      for (const s of porNombreClase('Spinning')) {
        asistenciasPayload.push({ sesionId: s.id, clienteId: juan.id, horaEntrada: s.fechaHora });
      }

      await prisma.asistencia.createMany({ data: asistenciasPayload });
      resultado.asistenciasCreadas = asistenciasPayload.length;
    }

    const productosDB = await prisma.producto.findMany();
    const byNombre = (nombre: string) => productosDB.find((p) => p.nombre === nombre);

    if (juan && ana && luis && productosDB.length >= 6) {
      const banco = byNombre('Banco inclinado')!;
      const mancuerna = byNombre('Mancuerna')!;
      const faja = byNombre('Faja')!;
      const mat = byNombre('Mat Premium')!;
      const ropa = byNombre('Productos Gym')!;
      const protector = byNombre('Protector de rodillas')!;

      const item = (productoId: string, cantidad: number, precioUnitario: number) => ({
        productoId,
        cantidad,
        precioUnitario,
        subtotal: precioUnitario * cantidad,
      });

      await prisma.orden.create({
        data: {
          usuarioId: juan.id,
          estado: 'COMPLETADA',
          total: banco.precio * 3 + mancuerna.precio * 2,
          items: {
            create: [
              item(banco.id, 3, banco.precio),
              item(mancuerna.id, 2, mancuerna.precio),
            ],
          },
        },
      });

      await prisma.orden.create({
        data: {
          usuarioId: ana.id,
          estado: 'PAGADA',
          total: faja.precio * 5 + mat.precio * 4 + ropa.precio * 6,
          items: {
            create: [
              item(faja.id, 5, faja.precio),
              item(mat.id, 4, mat.precio),
              item(ropa.id, 6, ropa.precio),
            ],
          },
        },
      });

      await prisma.orden.create({
        data: {
          usuarioId: luis.id,
          estado: 'ENVIADA',
          total: protector.precio * 2 + ropa.precio * 1,
          items: {
            create: [
              item(protector.id, 2, protector.precio),
              item(ropa.id, 1, ropa.precio),
            ],
          },
        },
      });

      await prisma.orden.create({
        data: {
          usuarioId: juan.id,
          estado: 'PENDIENTE',
          total: mat.precio * 1,
          items: { create: [item(mat.id, 1, mat.precio)] },
        },
      });

      resultado.ordenesCreadas = 4;
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