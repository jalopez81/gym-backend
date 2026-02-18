import prisma from '../modelos/prisma';
import { CrearAsistenciaDTO } from '../validadores/asistencia.validador';
import logger from '../config/logger';
import { verificarAsistenciaDuplicada, verificarCliente, verificarReserva, verificarSesion } from './helpers/asistencias.helper';

enum EstadoAsistencia {
  asistio,
  no_asistio,
  llego_tarde
}

export const marcarAsistencia = async (datos: CrearAsistenciaDTO) => {
  const { clienteId, sesionId, estado, horaEntrada } = datos;

  await verificarSesion(sesionId);
  await verificarCliente(clienteId);
  await verificarReserva(clienteId, sesionId);
  await verificarAsistenciaDuplicada(clienteId, sesionId);

  const asistencia = await prisma.asistencia.create({
    data: {
      clienteId,
      sesionId,
      estado,
      horaEntrada: horaEntrada ? new Date(horaEntrada) : new Date(),
    },
    include: {
      cliente: { select: { id: true, nombre: true, email: true } },
      sesion: { include: { clase: true } },
    },
  });

  logger.info(`Asistencia marcada: ${clienteId} en sesión ${sesionId}`);
  return asistencia;
};


export const obtenerAsistenciasPorSesion = async (sesionId: string) => {
  const sesion = await prisma.sesion.findUnique({
    where: { id: sesionId }
  });

  if (!sesion) {
    throw new Error('Sesión no encontrada');
  }

  return await prisma.asistencia.findMany({
    where: { sesionId },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    },
    orderBy: { creado: 'asc' }
  });
};

export const obtenerMiHistorialAsistencia = async (clienteId: string) => {
  return await prisma.asistencia.findMany({
    where: { clienteId },
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
          clase: {
            include: {
              entrenador: {
                include: {
                  usuario: {
                    select: { nombre: true }
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


export const obtenerTodasLasAsistencias = async () => {
  return await prisma.asistencia.findMany({
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

export const obtenerEstadisticasUsuario = async (clienteId: string) => {
  // Verificar que el usuario existe
  const usuario = await prisma.usuario.findUnique({
    where: { id: clienteId }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const asistencias = await prisma.asistencia.findMany({
    where: { clienteId }
  });

  const totalClases = asistencias.length;
  const asistio = asistencias.filter(a => a.estado === 'asistio').length;
  const noAsistio = asistencias.filter(a => a.estado === 'no_asistio').length;
  const llegoTarde = asistencias.filter(a => a.estado === 'llego_tarde').length;

  const porcentajeAsistencia = totalClases > 0 
    ? Math.round((asistio / totalClases) * 100) 
    : 0;

  return {
    usuarioId: clienteId,
    nombre: usuario.nombre,
    totalClases,
    asistio,
    noAsistio,
    llegoTarde,
    porcentajeAsistencia
  };
};