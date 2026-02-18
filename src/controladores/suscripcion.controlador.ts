import { Request, Response } from 'express';
import {
  crearSuscripcion,
  obtenerMiSuscripcion,
  obtenerTodasLasSuscripciones,
  cancelarSuscripcion,
  renovarSuscripcion,
  actualizarPlan
} from '../servicios/suscripcion.servicio';

import logger from '../config/logger';
import { crearSuscripcionSchema } from '../validadores/suscripcion.validador';

export const crear = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return res.status(401).json({ mensaje: 'No autenticado' });

    const datosValidados = crearSuscripcionSchema.parse(req.body);
    const suscripcion = await crearSuscripcion(usuarioId, datosValidados);
    res.status(201).json(suscripcion);
  } catch (error: any) {
    logger.error('Error al crear suscripción:', error);
    const mensaje =
      error.name === 'ZodError'
        ? 'Datos inválidos'
        : error.message || 'Error al crear suscripción';
    res.status(400).json({ mensaje });
  }
};

export const obtener = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return res.status(401).json({ mensaje: 'No autenticado' });

    const suscripcion = await obtenerMiSuscripcion(usuarioId);
    res.status(200).json(suscripcion);
  } catch (error: any) {
    logger.error('Error al obtener mi suscripción:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const suscripciones = await obtenerTodasLasSuscripciones();
    res.status(200).json(suscripciones);
  } catch (error: any) {
    logger.error('Error al listar suscripciones:', error);
    res.status(500).json({ mensaje: 'Error al listar suscripciones' });
  }
};

export const cancelar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;
    if (!usuarioId) return res.status(401).json({ mensaje: 'No autenticado' });

    const suscripcion = await cancelarSuscripcion(id, usuarioId);
    res.status(200).json(suscripcion);
  } catch (error: any) {
    logger.error('Error al cancelar suscripción:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

export const renovar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return res.status(401).json({ mensaje: 'No autenticado' });

    const datosValidados = crearSuscripcionSchema.parse(req.body);
    const suscripcion = await renovarSuscripcion(usuarioId, datosValidados);
    res.status(201).json(suscripcion);
  } catch (error: any) {
    logger.error('Error al renovar suscripción:', error);
    const mensaje =
      error.name === 'ZodError'
        ? 'Datos inválidos'
        : error.message || 'Error al renovar suscripción';
    res.status(400).json({ mensaje });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  const { id } = req.params
  const { planId } = req.body
  const retVal = await actualizarPlan(id, planId)
  res.json(retVal)
}
