import prisma from '../modelos/prisma';
import { CrearPlanDTO, ActualizarPlanDTO } from '../validadores/plan.validador';
import logger from '../config/logger';

export const crearPlan = async (datos: CrearPlanDTO) => {
  const plan = await prisma.plan.create({
    data: datos
  });

  logger.info(`Plan creado: ${plan.nombre}`);
  return plan;
};

export const obtenerPlanes = async () => {
  return await prisma.plan.findMany({
    orderBy: { precio: 'asc' }
  });
};

export const obtenerPlanPorId = async (id: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id }
  });

  if (!plan) {
    throw new Error('Plan no encontrado');
  }

  return plan;
};

export const actualizarPlan = async (id: string, datos: ActualizarPlanDTO) => {
  await obtenerPlanPorId(id);

  const plan = await prisma.plan.update({
    where: { id },
    data: datos
  });

  logger.info(`Plan actualizado: ${plan.nombre}`);
  return plan;
};

export const eliminarPlan = async (id: string) => {
  await obtenerPlanPorId(id);

  await prisma.plan.delete({
    where: { id }
  });

  logger.info(`Plan eliminado: ${id}`);
};