import prisma from '../modelos/prisma';
import { CrearSuscripcionDTO } from '../validadores/suscripcion.validador';
import logger from '../config/logger';
import { enviarEmail } from '../config/mailer';
import { templateSuscripcion } from '../utils/emailTemplates';
import { EstadoSuscripcion } from '@prisma/client';

export const crearSuscripcion = async (usuarioId: string, datos: CrearSuscripcionDTO) => {
  // Verificar que el usuario existe
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar que el plan existe
  const plan = await prisma.plan.findUnique({
    where: { id: datos.planId }
  });

  if (!plan) {
    throw new Error('Plan no encontrado');
  }

  // Verificar que no tenga una suscripción activa
  const suscripcionActiva = await prisma.suscripcion.findFirst({
    where: {
      usuarioId,
      estado: EstadoSuscripcion.ACTIVA
    }
  });

  if (suscripcionActiva) {
    throw new Error('Ya tienes una suscripción activa');
  }

  // Calcular fecha de vencimiento
  const fechaInicio = new Date();
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.duracionDias);

  const suscripcion = await prisma.suscripcion.create({
    data: {
      usuarioId,
      planId: datos.planId,
      fechaInicio,
      fechaVencimiento
    },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      plan: true
    }
  });

  // Enviar email de confirmación (sin bloquear)
  enviarEmail(
    suscripcion.usuario.email,
    'Suscripción Confirmada',
    templateSuscripcion(
      suscripcion.usuario.nombre,
      suscripcion.plan.nombre,
      suscripcion.plan.precio,
      suscripcion.fechaVencimiento.toLocaleDateString('es-ES')
    )
  );

  logger.info(`Suscripción creada: ${usuarioId} - Plan ${datos.planId}`);
  return suscripcion;
};

export const obtenerMiSuscripcion = async (usuarioId: string) => {
  const suscripcion = await prisma.suscripcion.findFirst({
    where: { usuarioId },
    include: {
      plan: true
    },
    orderBy: { creado: 'desc' }
  });

  if (!suscripcion) {
    throw new Error('No tienes una suscripción activa');
  }

  // Verificar si está vencida
  if (suscripcion.estado === EstadoSuscripcion.ACTIVA && new Date() > suscripcion.fechaVencimiento) {
    await prisma.suscripcion.update({
      where: { id: suscripcion.id },
      data: { estado: EstadoSuscripcion.VENCIDA }
      
    });

    throw new Error('Tu suscripción ha vencido');
  }

  return suscripcion;
};

export const obtenerTodasLasSuscripciones = async () => {
  const suscripciones = await prisma.suscripcion.findMany({
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      plan: true
    },
    orderBy: { creado: 'desc' }
  });

  // Actualizar suscripciones vencidas
  for (const suscripcion of suscripciones) {
    if (suscripcion.estado === EstadoSuscripcion.ACTIVA && new Date() > suscripcion.fechaVencimiento) {
      await prisma.suscripcion.update({
        where: { id: suscripcion.id },
        data: { estado: EstadoSuscripcion.VENCIDA },
      });
    }
  }

  return suscripciones;
};

export const cancelarSuscripcion = async (suscripcionId: string, usuarioId: string) => {
  const suscripcion = await prisma.suscripcion.findUnique({
    where: { id: suscripcionId }
  });

  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }

  // Verificar que pertenece al usuario
  if (suscripcion.usuarioId !== usuarioId) {
    throw new Error('No puedes cancelar una suscripción que no es tuya');
  }

  const suscripcionActualizada = await prisma.suscripcion.update({
    where: { id: suscripcionId },
    data: { estado: EstadoSuscripcion.CANCELADA },
  });

  logger.info(`Suscripción cancelada: ${suscripcionId}`);
  return suscripcionActualizada;
};

export const renovarSuscripcion = async (usuarioId: string, datos: CrearSuscripcionDTO) => {
  // Obtener suscripción anterior
  const suscripcionAnterior = await prisma.suscripcion.findFirst({
    where: { usuarioId }
  });

  if (suscripcionAnterior) {
    // Marcar como cancelada
    await prisma.suscripcion.update({
      where: { id: suscripcionAnterior.id },
      data: { estado: EstadoSuscripcion.CANCELADA },
    });
  }

  // Crear nueva suscripción
  return await crearSuscripcion(usuarioId, datos);
};

export const verificarSuscripcionActiva = async (usuarioId: string): Promise<boolean> => {
  const suscripcion = await prisma.suscripcion.findFirst({
    where: {
      usuarioId,
      estado: EstadoSuscripcion.ACTIVA
    }
  });

  if (!suscripcion) {
    return false;
  }

  // Verificar si no está vencida
  if (new Date() > suscripcion.fechaVencimiento) {
    await prisma.suscripcion.update({
      where: { id: suscripcion.id },
      data: { estado: EstadoSuscripcion.VENCIDA} 
    });
    return false;
  }

  return true;
};

export const actualizarPlan = async (id: string, planId: string) => {
  return prisma.suscripcion.update({
    where: { id },
    data: { planId },
    include: { plan: true }
  })
}

