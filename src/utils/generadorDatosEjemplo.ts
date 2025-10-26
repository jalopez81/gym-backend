import prisma from '../modelos/prisma';
import { generarHash } from './hash';
import logger from '../config/logger';

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
        rol: 'admin'
      },
      {
        email: 'carlos@gym.com',
        nombre: 'Carlos García',
        password: await generarHash('123456'),
        rol: 'entrenador'
      },
      {
        email: 'maria@gym.com',
        nombre: 'María López',
        password: await generarHash('123456'),
        rol: 'entrenador'
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
    nombre: 'Guantes de entrenamiento',
    descripcion: 'Guantes profesionales para levantamiento de pesas',
    precio: 25.99,
    stock: 50,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Botella de agua deportiva',
    descripcion: 'Botella reutilizable de 1 litro',
    precio: 15.99,
    stock: 100,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Proteína Whey',
    descripcion: 'Proteína de suero de 2kg',
    precio: 45.99,
    stock: 30,
    categoria: 'Suplementos'
  },
  {
    nombre: 'Banda elástica de resistencia',
    descripcion: 'Set de 5 bandas de diferentes resistencias',
    precio: 19.99,
    stock: 40,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Camiseta deportiva',
    descripcion: 'Camiseta de secado rápido',
    precio: 29.99,
    stock: 80,
    categoria: 'Ropa'
  },
  {
    nombre: 'Protector de rodillas',
    descripcion: 'Protección para entrenamiento intenso',
    precio: 22.99,
    stock: 35,
    categoria: 'Protección'
  },
  {
    nombre: 'Mancuerna ajustable',
    descripcion: 'Mancuerna de 2.5 a 15 kg',
    precio: 89.99,
    stock: 20,
    categoria: 'Equipos'
  },
  {
    nombre: 'Mat de yoga',
    descripcion: 'Tapete antideslizante de 6mm',
    precio: 34.99,
    stock: 45,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Cuerda para saltar',
    descripcion: 'Cuerda ajustable para cardio',
    precio: 12.99,
    stock: 60,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Bandas de resistencia',
    descripcion: 'Set de 3 bandas para entrenamiento',
    precio: 17.99,
    stock: 50,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Guantes de boxeo',
    descripcion: 'Guantes acolchados para boxeo',
    precio: 35.99,
    stock: 25,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Rodillera deportiva',
    descripcion: 'Protección para articulaciones durante el entrenamiento',
    precio: 28.99,
    stock: 40,
    categoria: 'Protección'
  },
  {
    nombre: 'Saco de arena para boxeo',
    descripcion: 'Saco de 25 kg para entrenamiento de fuerza y resistencia',
    precio: 120.99,
    stock: 10,
    categoria: 'Equipos'
  },
  {
    nombre: 'Zapatillas de running',
    descripcion: 'Calzado ligero y transpirable para correr',
    precio: 75.99,
    stock: 60,
    categoria: 'Ropa'
  },
  {
    nombre: 'Kettlebell 12kg',
    descripcion: 'Pesa rusa para entrenamiento funcional',
    precio: 49.99,
    stock: 30,
    categoria: 'Equipos'
  },
  {
    nombre: 'Reloj deportivo GPS',
    descripcion: 'Monitor de ritmo cardíaco y distancia',
    precio: 199.99,
    stock: 15,
    categoria: 'Tecnología'
  },
  {
    nombre: 'Colchoneta pilates',
    descripcion: 'Tapete cómodo para ejercicios de pilates y estiramientos',
    precio: 27.99,
    stock: 50,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Camiseta compresiva',
    descripcion: 'Camiseta de compresión para mejorar recuperación',
    precio: 39.99,
    stock: 35,
    categoria: 'Ropa'
  },
  {
    nombre: 'Guantes de ciclismo',
    descripcion: 'Guantes acolchados para mayor comodidad en bicicleta',
    precio: 18.99,
    stock: 45,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Bicicleta estática',
    descripcion: 'Bicicleta indoor con resistencia ajustable',
    precio: 299.99,
    stock: 8,
    categoria: 'Equipos'
  }
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
      where: { rol: 'entrenador' }
    });

    for (const usuario of usuarios) {
      const entrenadorExistente = await prisma.entrenador.findUnique({
        where: { usuarioId: usuario.id }
      });

      if (!entrenadorExistente) {
        const especialidades = ['Levantamiento de pesas', 'Cardio', 'Yoga', 'Pilates'];
        const especialidadAleatoria =
          especialidades[Math.floor(Math.random() * especialidades.length)];

        await prisma.entrenador.create({
          data: {
            usuarioId: usuario.id,
            especialidad: especialidadAleatoria,
            experiencia: Math.floor(Math.random() * 15) + 1,
            certificaciones: 'NASM, ACE'
          }
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
        precio: 19.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, Sin entrenador personal'
      },
      {
        nombre: 'Premium',
        descripcion: 'Acceso a todas las clases + 2 sesiones con entrenador',
        precio: 49.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, 2 sesiones con entrenador, Acceso 24/7'
      },
      {
        nombre: 'Gold',
        descripcion: 'Acceso total + Entrenador personal dedicado',
        precio: 99.99,
        duracionDias: 30,
        beneficios: 'Clases ilimitadas, Entrenador personal, Acceso 24/7, Plan nutricional'
      }
    ];

    for (const planData of planesData) {
      const planExistente = await prisma.plan.findUnique({
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