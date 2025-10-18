import prisma from '../modelos/prisma';
import { CrearEntrenadorDTO, ActualizarEntrenadorDTO } from '../validadores/entrenador.validador';
import logger from '../config/logger';

export const crearEntrenador = async (datos: CrearEntrenadorDTO) => {
  // Verificar que el usuario existe
  const usuario = await prisma.usuario.findUnique({
    where: { id: datos.usuarioId }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar que el usuario no sea ya un entrenador
  const entrenadorExistente = await prisma.entrenador.findUnique({
    where: { usuarioId: datos.usuarioId }
  });

  if (entrenadorExistente) {
    throw new Error('Este usuario ya es un entrenador');
  }

  const entrenador = await prisma.entrenador.create({
    data: datos,
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      },
      clientes: {
        where: { activo: true },
        include: {
          cliente: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      }
    }
  });

  logger.info(`Entrenador creado: ${usuario.nombre}`);
  return entrenador;
};

export const obtenerEntrenadores = async () => {
  return await prisma.entrenador.findMany({
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      },
      clientes: {
        where: { activo: true },
        include: {
          cliente: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const obtenerEntrenadorPorId = async (id: string) => {
  const entrenador = await prisma.entrenador.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      },
      clientes: {
        where: { activo: true },
        include: {
          cliente: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      }
    }
  });

  if (!entrenador) {
    throw new Error('Entrenador no encontrado');
  }

  return entrenador;
};

export const obtenerEntrenadorPorUsuarioId = async (usuarioId: string) => {
  const entrenador = await prisma.entrenador.findUnique({
    where: { usuarioId },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      },
      clientes: {
        where: { activo: true },
        include: {
          cliente: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      }
    }
  });

  if (!entrenador) {
    throw new Error('Entrenador no encontrado');
  }

  return entrenador;
};

export const actualizarEntrenador = async (
  id: string,
  datos: ActualizarEntrenadorDTO
) => {
  // Verificar que existe
  await obtenerEntrenadorPorId(id);

  const entrenador = await prisma.entrenador.update({
    where: { id },
    data: datos,
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          nombre: true
        }
      },
      clientes: {
        where: { activo: true },
        include: {
          cliente: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      }
    }
  });

  logger.info(`Entrenador actualizado: ${id}`);
  return entrenador;
};

export const eliminarEntrenador = async (id: string) => {
  // Verificar que existe
  await obtenerEntrenadorPorId(id);

  await prisma.entrenador.delete({
    where: { id }
  });

  logger.info(`Entrenador eliminado: ${id}`);
};

export const asignarClienteAEntrenador = async (
  entrenadorId: string,
  clienteId: string
) => {
  // Verificar que ambos existen
  await obtenerEntrenadorPorId(entrenadorId);

  const cliente = await prisma.usuario.findUnique({
    where: { id: clienteId }
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  // Desactivar asignaciones anteriores del cliente
  await prisma.asignacionEntrenador.updateMany({
    where: { clienteId, activo: true },
    data: { activo: false }
  });

  // Crear nueva asignación
  const asignacion = await prisma.asignacionEntrenador.create({
    data: {
      entrenadorId,
      clienteId
    }
  });

  logger.info(`Cliente ${clienteId} asignado a entrenador ${entrenadorId}`);
  return asignacion;
};

export const desasignarClienteDeEntrenador = async (
  entrenadorId: string,
  clienteId: string
) => {
  const result = await prisma.asignacionEntrenador.updateMany({
    where: {
      entrenadorId,
      clienteId,
      activo: true
    },
    data: { activo: false }
  });

  logger.info(`Cliente ${clienteId} desasignado del entrenador ${entrenadorId}`);
};