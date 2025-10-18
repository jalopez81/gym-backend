import { Request, Response } from 'express';
import {
  crearPlan,
  obtenerPlanes,
  obtenerPlanPorId,
  actualizarPlan,
  eliminarPlan
} from '../servicios/plan.servicio';
import {
  crearPlanSchema,
  actualizarPlanSchema
} from '../validadores/plan.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const datosValidados = crearPlanSchema.parse(req.body);
    const plan = await crearPlan(datosValidados);

    res.status(201).json({
      mensaje: 'Plan creado exitosamente',
      datos: plan
    });
  } catch (error: any) {
    logger.error('Error al crear plan:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear plan'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const planes = await obtenerPlanes();

    res.status(200).json({
      mensaje: 'Planes obtenidos exitosamente',
      datos: planes
    });
  } catch (error: any) {
    logger.error('Error al listar planes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener planes'
    });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await obtenerPlanPorId(id);

    res.status(200).json({
      mensaje: 'Plan obtenido exitosamente',
      datos: plan
    });
  } catch (error: any) {
    logger.error('Error al obtener plan:', error);
    res.status(404).json({
      mensaje: error.message || 'Plan no encontrado'
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datosValidados = actualizarPlanSchema.parse(req.body);
    const plan = await actualizarPlan(id, datosValidados);

    res.status(200).json({
      mensaje: 'Plan actualizado exitosamente',
      datos: plan
    });
  } catch (error: any) {
    logger.error('Error al actualizar plan:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar plan'
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eliminarPlan(id);

    res.status(200).json({
      mensaje: 'Plan eliminado exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar plan:', error);
    res.status(404).json({
      mensaje: error.message || 'Plan no encontrado'
    });
  }
};