import prisma from '../modelos/prisma';
import { generarHash } from './hash';
import logger from '../config/logger';
import { ROLES } from '../middlewares/auth.middleware';

interface DatosEjemplo {
  usuariosCreados: number;
  productosCreados: number;
  entrenadoresCreados: number;
  clasesCreadas?: number;
  planesCreados?: number;
}

export const generarDatosEjemplo = async (): Promise<DatosEjemplo> => {
  const resultado: DatosEjemplo = {
    usuariosCreados: 0,
    productosCreados: 0,
    entrenadoresCreados: 0
  };

  try {
    // Generar usuarios
    const usuariosData = [
      {
        email: 'admin@gym.com',
        nombre: 'Administrador',
        password: await generarHash('admin123'),
        rol: ROLES.ADMIN
      },
      {
        email: 'carlos@gym.com',
        nombre: 'Carlos García',
        password: await generarHash('123456'),
        rol: ROLES.ENTRENADOR
      },
      {
        email: 'maria@gym.com',
        nombre: 'María López',
        password: await generarHash('123456'),
        rol: ROLES.ENTRENADOR
      },
      {
        email: 'juan@gym.com',
        nombre: 'Juan Pérez',
        password: await generarHash('123456'),
        rol: 'cliente'
      },
      {
        email: 'ana@gym.com',
        nombre: 'Ana Martínez',
        password: await generarHash('123456'),
        rol: 'cliente'
      },
      {
        email: 'luis@gym.com',
        nombre: 'Luis Rodríguez',
        password: await generarHash('123456'),
        rol: 'cliente'
      },
      {
        email: 'recepcion@gym.com',
        nombre: 'Recepcionista',
        password: await generarHash('123456'),
        rol: 'recepcionista'
      }
    ];

    for (const usuarioData of usuariosData) {
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: usuarioData.email }
      });

      if (!usuarioExistente) {
        await prisma.usuario.create({
          data: usuarioData
        });
        resultado.usuariosCreados++;
      }
    }

    // Generar productos
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


    for (const productoData of productosData) {
      const productoExistente = await prisma.producto.findFirst({
        where: { nombre: productoData.nombre }
      });

      if (!productoExistente) {
        await prisma.producto.create({
          data: productoData
        });
        resultado.productosCreados++;
      }
    }

    // Generar entrenadores (sin relación con clientes)
    const usuarios = await prisma.usuario.findMany({
      where: { rol: ROLES.ENTRENADOR }
    });

    for (const usuario of usuarios) {
      const entrenadorExistente = await prisma.entrenador.findUnique({
        where: { usuarioId: usuario.id }
      });

      if (!entrenadorExistente) {
        const especialidades = ['Levantamiento de pesas', 'Cardio', 'Yoga', 'Pilates'];
        const especialidadAleatoria =
          especialidades[Math.floor(Math.random() * especialidades.length)];

        await prisma.$transaction(async (tx) => {
          const entrenador = await tx.entrenador.create({
            data: {
              usuario: { connect: { id: usuario.id } },
              especialidad: especialidadAleatoria,
              experiencia: Math.floor(Math.random() * 15) + 1,
              certificaciones: 'NASM, ACE'
            }
          });

          await tx.usuario.update({
            where: { id: usuario.id },
            data: {
              imagenPublicId: 'trainerw_so8xhb',
              imagenSecureUrl: 'https://res.cloudinary.com/dhf0il3ul/image/upload/v1761674355/trainerw_so8xhb.jpg'
            }
          });

          return entrenador;
        });
        resultado.entrenadoresCreados++;
      }
    }

    logger.info('Datos de ejemplo generados correctamente');

    // Generar clases y sesiones
    const entrenadores = await prisma.entrenador.findMany();

    if (entrenadores.length > 0) {
      const clasesData = [
        {
          nombre: 'Yoga Matutino',
          descripcion: 'Clase de yoga para principiantes',
          duracion: 60,
          capacidad: 15,
          entrenadorId: entrenadores[0].id
        },
        {
          nombre: 'CrossFit',
          descripcion: 'Entrenamiento de alta intensidad',
          duracion: 90,
          capacidad: 20,
          entrenadorId: entrenadores[0].id
        },
        {
          nombre: 'Pilates',
          descripcion: 'Fortalecimiento del core',
          duracion: 50,
          capacidad: 12,
          entrenadorId: entrenadores[1]?.id || entrenadores[0].id
        }
      ];

      for (const claseData of clasesData) {
        const claseExistente = await prisma.clase.findFirst({
          where: { nombre: claseData.nombre }
        });

        if (!claseExistente) {
          const clase = await prisma.clase.create({
            data: claseData
          });

          // Crear sesiones para cada clase
          for (let i = 0; i < 3; i++) {
            const fechaHora = new Date();
            fechaHora.setDate(fechaHora.getDate() + i + 1);
            fechaHora.setHours(9, 0, 0, 0);

            await prisma.sesion.create({
              data: {
                claseId: clase.id,
                fechaHora
              }
            });
          }

          resultado.clasesCreadas = (resultado.clasesCreadas || 0) + 1;
        }
      }
    }

    // Generar planes
    const planesData = [
      {
        nombre: 'Básico',
        descripcion: 'Acceso a todas las clases grupales',
        precio: 499.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, Sin entrenador personal',
        nivel: 1
      },
      {
        nombre: 'Premium',
        descripcion: 'Acceso a todas las clases + 2 sesiones con entrenador',
        precio: 999.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, 2 sesiones con entrenador, Acceso 24/7',
        nivel: 2
      },
      {
        nombre: 'Gold',
        descripcion: 'Acceso total + Entrenador personal dedicado',
        precio: 1599.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, Entrenador personal, Acceso 24/7, Plan nutricional',
        nivel: 3
      }
    ];

    for (const planData of planesData) {
      const planExistente = await prisma.plan.findFirst({
        where: { nombre: planData.nombre }
      });

      if (!planExistente) {
        await prisma.plan.create({
          data: planData
        });
        resultado.planesCreados = (resultado.planesCreados || 0) + 1;
      }
    }
    return resultado;
  } catch (error) {
    logger.error('Error al generar datos de ejemplo:', error);
    throw error;
  }
};