import prisma from '../modelos/prisma';
import { CrearReservaDTO } from '../validadores/reserva.validador';
import logger from '../config/logger';

export const crearReserva = async (clienteId: string, datos: CrearReservaDTO) => {
  // Verificar que la sesión existe
  const sesion = await prisma.sesion.findUnique({
    where: { id: datos.sesionId },
    include: {
      clase: true,
      reservas: true
    }
  });

  if (!sesion) {
    throw new Error('Sesión no encontrada');
  }

  // Verificar capacidad
  if (sesion.reservas.length >= sesion.clase.capacidad) {
    throw new Error('La clase está llena');
  }

  // Verificar que el cliente no tenga otra reserva en el mismo horario
  const conflicto = await prisma.reserva.findFirst({
    where: {
      clienteId,
      sesion: {
        fechaHora: sesion.fechaHora
      },
      estado: 'reservado'
    }
  });

  if (conflicto) {
    throw new Error('Ya tienes una reserva en este horario');
  }

  // Verificar que el cliente existe
  const cliente = await prisma.usuario.findUnique({
    where: { id: clienteId }
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  const reserva = await prisma.reserva.create({
    data: {
      clienteId,
      sesionId: datos.sesionId
    },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      sesion: {
        include: {
          clase: true
        }
      }
    }
  });

  logger.info(`Reserva creada: ${clienteId} - Sesión ${datos.sesionId}`);
  return reserva;
};

export const obtenerMisReservas = async (clienteId: string) => {
  return await prisma.reserva.findMany({
    where: { clienteId },
    include: {
      sesion: {
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
          }
        }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const obtenerTodasLasReservas = async () => {
  return await prisma.reserva.findMany({
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      sesion: {
        include: {
          clase: true
        }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const obtenerReservasPorSesion = async (sesionId: string) => {
  return await prisma.reserva.findMany({
    where: { sesionId },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    }
  });
};

export const cancelarReserva = async (reservaId: string, clienteId: string) => {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId }
  });

  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }

  // Verificar que el cliente sea dueño de la reserva
  if (reserva.clienteId !== clienteId) {
    throw new Error('No puedes cancelar una reserva que no es tuya');
  }

  const reservaActualizada = await prisma.reserva.update({
    where: { id: reservaId },
    data: { estado: 'cancelado' }
  });

  logger.info(`Reserva cancelada: ${reservaId}`);
  return reservaActualizada;
};