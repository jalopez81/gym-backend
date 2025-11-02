import prisma from '../modelos/prisma';
import { CrearSesionDTO, ActualizarSesionDTO } from '../validadores/sesion.validador';
import logger from '../config/logger';

export const crearSesion = async (datos: CrearSesionDTO) => {
  // Verificar que la clase existe
  const clase = await prisma.clase.findUnique({
    where: { id: datos.claseId }
  });

  if (!clase) {
    throw new Error('Clase no encontrada');
  }

  // Verificar que la fecha no sea en el pasado
  const fechaHora = new Date(datos.fechaHora);
  if (fechaHora < new Date()) {
    throw new Error('La fecha no puede ser anterior a la fecha de hoy.');
  }

  const sesion = await prisma.sesion.create({
    data: {
      claseId: datos.claseId,
      fechaHora: fechaHora
    },
    include: {
      clase: {
        include: {
          entrenador: {
            include: {
              usuario: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      },
      reservas: true
    }
  });

  logger.info(`Sesión creada: ${datos.claseId}`);
  return sesion;
};

export const obtenerSesiones = async () => {
  return await prisma.sesion.findMany({
    include: {      
      clase: {         
        include: {
          entrenador: {
            include: {
              usuario: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      },
      reservas: true
    },
    orderBy: { fechaHora: 'asc' }
  });
};

export const obtenerSesionPorId = async (id: string) => {
  const sesion = await prisma.sesion.findUnique({
    where: { id },
    include: {
      clase: {
        include: {
          entrenador: {
            include: {
              usuario: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      },
      reservas: {
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!sesion) {
    throw new Error('Sesión no encontrada');
  }

  return sesion;
};

export const actualizarSesion = async (id: string, datos: ActualizarSesionDTO) => {
  await obtenerSesionPorId(id);

  if (datos.fechaHora) {
    const fechaHora = new Date(datos.fechaHora);
    if (fechaHora < new Date()) {
      throw new Error('No se puede cambiar a una fecha en el pasado');
    }
  }

  const sesion = await prisma.sesion.update({
    where: { id },
    data: datos,
    include: {
      clase: true,
      reservas: true
    }
  });

  logger.info(`Sesión actualizada: ${id}`);
  return sesion;
};

export const eliminarSesion = async (id: string) => {
  await obtenerSesionPorId(id);

  await prisma.sesion.delete({
    where: { id }
  });

  logger.info(`Sesión eliminada: ${id}`);
};

export const obtenerSesionesPorClase = async (claseId: string) => {
  return await prisma.sesion.findMany({
    where: { claseId },
    include: {
      clase: true,
      reservas: true
    },
    orderBy: { fechaHora: 'asc' }
  });
};