import prisma from '../modelos/prisma';
import { CrearClaseDTO, ActualizarClaseDTO } from '../validadores/clase.validador';
import logger from '../config/logger';

export const crearClase = async (datos: CrearClaseDTO) => {
  // Verificar que el entrenador existe
  const entrenador = await prisma.entrenador.findUnique({
    where: { id: datos.entrenadorId }
  });

  if (!entrenador) {
    throw new Error('Entrenador no encontrado');
  }

  const clase = await prisma.clase.create({
    data: datos,
    include: {
      entrenador: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      sesiones: true
    }
  });

  logger.info(`Clase creada: ${clase.nombre}`);
  return clase;
};

export const obtenerClases = async () => {
  return await prisma.clase.findMany({
    include: {
      entrenador: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      sesiones: {
        orderBy: { fechaHora: 'asc' }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const obtenerClasePorId = async (id: string) => {
  const clase = await prisma.clase.findUnique({
    where: { id },
    include: {
      entrenador: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      sesiones: {
        orderBy: { fechaHora: 'asc' }
      }
    }
  });

  if (!clase) {
    throw new Error('Clase no encontrada');
  }

  return clase;
};

export const actualizarClase = async (id: string, datos: ActualizarClaseDTO) => {
  await obtenerClasePorId(id);

  const clase = await prisma.clase.update({
    where: { id },
    data: datos,
    include: {
      entrenador: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      sesiones: true
    }
  });

  logger.info(`Clase actualizada: ${clase.nombre}`);
  return clase;
};

export const eliminarClase = async (id: string) => {
  await obtenerClasePorId(id);

  await prisma.clase.delete({
    where: { id }
  });

  logger.info(`Clase eliminada: ${id}`);
};