import { PrismaClient } from '@prisma/client';
import { ROLES } from '../middlewares/auth.middleware';
import { generarHash } from './hash';
const prisma = new PrismaClient();

interface DatosEjemplo {
  usuariosCreados: number;
  productosCreados: number;
  entrenadoresCreados: number;
  planesCreados: number;
  clasesCreadas?: number;
  sesionesCreadas?: number;
  ordenesCreadas?: number;
}

export const generarDatosEjemplo = async (): Promise<DatosEjemplo> => {
  const resultado: DatosEjemplo = {
    usuariosCreados: 0,
    productosCreados: 0,
    entrenadoresCreados: 0,
    planesCreados: 0,
    clasesCreadas: 0,
    sesionesCreadas: 0,
    ordenesCreadas: 0,
  }

  try {
    console.log('Borrando datos existentes...');

    await prisma.ordenItem.deleteMany();
    await prisma.orden.deleteMany();
    await prisma.carritoItem.deleteMany();
    await prisma.asistencia.deleteMany();
    await prisma.reserva.deleteMany();
    await prisma.sesion.deleteMany();
    await prisma.clase.deleteMany();
    await prisma.asignacionEntrenador.deleteMany();
    await prisma.entrenador.deleteMany();
    await prisma.suscripcion.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.configuracion.deleteMany();

    console.log('Insertando datos base...');

    // usuarios
    const passwordHash = await generarHash('123456');
    const usuariosData = [
      {
        email: "admin@gym.com",
        nombre: "Administrador",
        password: passwordHash,
        rol: ROLES.ADMIN,
        creado: new Date("2025-11-09T01:48:36.694Z"),
        status: 'activo',
      },
      {
        email: "carlos@gym.com",
        nombre: "Carlos García",
        imagenPublicId: "entrenador_no_2_s4kbtu",
        imagenUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/entrenador_no_2_s4kbtu.jpg",
        imagenSecureUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/entrenador_no_2_s4kbtu.jpg",
        password: passwordHash,
        rol: ROLES.ENTRENADOR,
        creado: new Date("2025-11-09T01:48:36.710Z"),
        status: 'activo',
      },
      {
        nombre: "Julio Iglesias",
        email: "julio@gym.com",
        imagenPublicId: "trainer_3_ypilrf",
        imagenUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1762266352/trainer_3_ypilrf.jpg",
        imagenSecureUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1762266352/trainer_3_ypilrf.jpg",
        password: passwordHash,
        rol: ROLES.ENTRENADOR,
        creado: new Date("2025-11-09T01:48:36.712Z"),
        status: 'activo',
      },
      {
        email: "maria@gym.com",
        nombre: "María López",
        imagenPublicId: "trainerw_so8xhb",
        imagenUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/trainerw_so8xhb.jpg",
        imagenSecureUrl: "https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/trainerw_so8xhb.jpg",
        password: passwordHash,
        rol: ROLES.ENTRENADOR,
        creado: new Date("2025-11-09T01:48:36.712Z"),
        status: 'activo',
      },
      {
        email: "juan@gym.com",
        nombre: "Juan Pérez",
        password: passwordHash,
        rol: ROLES.CLIENTE,
        creado: new Date("2025-11-09T01:48:36.715Z"),
        status: 'activo',
      },
      {
        email: "ana@gym.com",
        nombre: "Ana Martínez",
        password: passwordHash,
        rol: ROLES.CLIENTE,
        creado: new Date("2025-11-09T01:48:36.719Z"),
        status: 'activo',
      },
      {
        email: "luis@gym.com",
        nombre: "Luis Rodríguez",
        password: passwordHash,
        rol: ROLES.CLIENTE,
        creado: new Date("2025-11-09T01:48:36.722Z"),
        status: 'activo',
      },
      {
        email: "recepcion@gym.com",
        nombre: "Recepcionista",
        password: passwordHash,
        rol: ROLES.RECEPCIONISTA,
        creado: new Date("2025-11-09T01:48:36.725Z"),
        status: 'activo',
      },
    ];

    for (const usuario of usuariosData) {
      await prisma.usuario.create({
        data: usuario
      })
      resultado.usuariosCreados += 1;
    }

    // entrenadores
    const arrEntrenadores = await prisma.usuario.findMany({ where: { rol: ROLES.ENTRENADOR } })
    const especialidades = ["Fuerza", "Cardio", "Yoga", "Pilates", "CrossFit", "Natación"];
    const certificaciones = ["ACE", "NASM", "ISSA", "ACSM", "NSCA", "CPR"];

    for (const entrenador of arrEntrenadores) {
      await prisma.entrenador.create({
        data: {
          usuarioId: entrenador.id,
          especialidad: especialidades[Math.floor(Math.random() * especialidades.length)],
          certificaciones: certificaciones[Math.floor(Math.random() * certificaciones.length)],
          experiencia: 5,
        }
      })
      resultado.entrenadoresCreados += 1;
    }

    // productos
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

    for (const producto of productosData) {
      await prisma.producto.create({
        data: producto
      })
      resultado.productosCreados += 1;
    }

    // planes

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
    for (const plan of planesData) {
      await prisma.plan.create({
        data: plan
      })
      resultado.planesCreados += 1;
    }

    // clases y sesiones
    const entrenadoresIds = await prisma.entrenador.findMany().then(entrenadores => entrenadores.map(e => e.id));
    if (entrenadoresIds.length === 0) {
      console.warn("No hay entrenadores disponibles, no se crearán clases.");
    } else {
      const clasesData = [
        { nombre: 'Yoga para principiantes', descripcion: 'Clase de yoga enfocada en posturas básicas y respiración.', duracion: 60, capacidad: 15 },
        { nombre: 'HIIT avanzado', descripcion: 'Entrenamiento de alta intensidad para quemar grasa y mejorar resistencia.', duracion: 45, capacidad: 20 },
        { nombre: 'Pilates intermedio', descripcion: 'Clase de pilates para fortalecer el core y mejorar la flexibilidad.', duracion: 50, capacidad: 10 },
        { nombre: 'CrossFit básico', descripcion: 'Introducción al CrossFit con ejercicios funcionales y trabajo en equipo.', duracion: 60, capacidad: 25 },
        { nombre: 'Natación para todos', descripcion: 'Clase de natación para mejorar técnica y resistencia en el agua.', duracion: 55, capacidad: 15 },
        { nombre: 'Cardio Dance', descripcion: 'Clase divertida que combina baile y ejercicios cardiovasculares.', duracion: 50, capacidad: 30 },
      ];

      for (let i = 0; i < clasesData.length; i++) {
        // asignar entrenador de forma cíclica
        const entrenadorId = entrenadoresIds[i % entrenadoresIds.length];
        const clase = { ...clasesData[i], entrenadorId };

        const claseCreada = await prisma.clase.create({
          data: clase
        });

        // crear 5 sesiones en los próximos días
        for (let j = 1; j <= 5; j++) {
          const fechaSesion = new Date();
          fechaSesion.setDate(fechaSesion.getDate() + j);
          fechaSesion.setHours(10 + j, 0, 0, 0); // diferentes horas

          await prisma.sesion.create({
            data: {
              claseId: claseCreada.id,
              fechaHora: fechaSesion,
            }
          });
        }

        resultado.clasesCreadas! += 1;
      }
    }
    
    const clientes = await prisma.usuario.findMany({ where: { rol: ROLES.CLIENTE } });
    const sesiones = await prisma.sesion.findMany();
    for (const cliente of clientes) {
      for (const sesion of sesiones) {
        // crear reserva
        await prisma.reserva.create({
          data: {
            clienteId: cliente.id,
            sesionId: sesion.id,
            estado: 'reservado',
          }
        })
        resultado.sesionesCreadas! += 1;

        // crear asistencia
        await prisma.asistencia.create({
          data: {
            clienteId: cliente.id,
            sesionId: sesion.id,
            estado: 'asistio',
            horaEntrada: sesion.fechaHora,
          }
        })
      }
    }

    // ordenes
    /*
    model Orden {
  id        String      @id @default(uuid())
  usuarioId String
  usuario   Usuario     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  items     OrdenItem[]
  total     Float
  estado    String      @default("pendiente")
  creado    DateTime    @default(now())

  @@map("ordenes")
}

model OrdenItem {
  id             String   @id @default(uuid())
  ordenId        String
  orden          Orden    @relation(fields: [ordenId], references: [id], onDelete: Cascade)
  productoId     String
  producto       Producto @relation(fields: [productoId], references: [id])
  cantidad       Int
  precioUnitario Float
  subtotal       Float

  @@map("orden_items")
}
     */
    const clientesIds = clientes.map(c => c.id);
    const productos = await prisma.producto.findMany();
    for (let i = 0; i < 5; i++) {
      const clienteId = clientesIds[i % clientesIds.length];
      const orden = await prisma.orden.create({
        data: {
          usuarioId: clienteId,
          total: 0,
          estado: 'COMPLETADA',
        }
      });
      let totalOrden = 0;
      for (let j = 0; j < 2; j++) {
        const producto = productos[Math.floor(Math.random() * productos.length)];
        const cantidad = Math.floor(Math.random() * 3) + 1;
        const subtotal = producto.precio * cantidad;
        totalOrden += subtotal;
        await prisma.ordenItem.create({
          data: {
            ordenId: orden.id,
            productoId: producto.id,
            cantidad,
            precioUnitario: producto.precio,
            subtotal,
          }
        });
      }
      // actualizar total de la orden
      await prisma.orden.update({
        where: { id: orden.id },
        data: { total: totalOrden },
      });
    }
    resultado.ordenesCreadas! += 5;
    













  } catch (err) {
    console.log(err)
  }


  // return los resultados
  return resultado;
}