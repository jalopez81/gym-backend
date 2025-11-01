import prisma from '../modelos/prisma';
import { CrearAsistenciaDTO } from '../validadores/asistencia.validador';
import logger from '../config/logger';

enum EstadoAsistencia {
  asistio,
  no_asistio,
  llego_tarde
}


export const marcarAsistencia = async (datos: CrearAsistenciaDTO) => {
  // Verificar que la sesión existe
  const sesion = await prisma.sesion.findUnique({
    where: { id: datos.sesionId },
    include: { clase: true }
  });

  if (!sesion) {
    throw new Error('Sesión no encontrada');
  }

  // Verificar que el cliente existe
  const cliente = await prisma.usuario.findUnique({
    where: { id: datos.clienteId }
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  // Verificar que existe una reserva
  const reserva = await prisma.reserva.findFirst({
    where: {
      sesionId: datos.sesionId,
      clienteId: datos.clienteId
    }
  });

  if (!reserva) {
    throw new Error('El cliente no tiene reserva en esta sesión');
  }

  // Verificar que no exista asistencia previa
  const asistenciaExistente = await prisma.asistencia.findFirst({
    where: {
      sesionId: datos.sesionId,
      clienteId: datos.clienteId
    }
  });

  if (asistenciaExistente) {
    throw new Error('La asistencia ya ha sido marcada para este cliente en esta sesión');
  }

  const asistencia = await prisma.asistencia.create({
    data: {
      sesionId: datos.sesionId,
      clienteId: datos.clienteId,
      estado: datos.estado,
      horaEntrada: datos.horaEntrada ? new Date(datos.horaEntrada) : null
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

  logger.info(`Asistencia marcada: ${datos.clienteId} en sesión ${datos.sesionId}`);
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