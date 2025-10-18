import { Request, Response } from 'express';
import {
  crearSuscripcion,
  obtenerMiSuscripcion,
  obtenerTodasLasSuscripciones,
  cancelarSuscripcion,
  renovarSuscripcion
} from '../servicios/suscripcion.servicio';

import logger from '../config/logger';
import { crearSuscripcionSchema } from '../validadores/suscripcion.validador';

export const crear = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosValidados = crearSuscripcionSchema.parse(req.body);
    const suscripcion = await crearSuscripcion(usuarioId, datosValidados);

    res.status(201).json({
      mensaje: 'Suscripción creada exitosamente',
      datos: suscripcion
    });
  } catch (error: any) {
    logger.error('Error al crear suscripción:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear suscripción'
    });
  }
};

export const obtenerMia = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const suscripcion = await obtenerMiSuscripcion(usuarioId);

    res.status(200).json({
      mensaje: 'Suscripción obtenida exitosamente',
      datos: suscripcion
    });
  } catch (error: any) {
    logger.error('Error al obtener suscripción:', error);
    res.status(400).json({
      mensaje: error.message || 'No tienes una suscripción activa'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const suscripciones = await obtenerTodasLasSuscripciones();

    res.status(200).json({
      mensaje: 'Suscripciones obtenidas exitosamente',
      datos: suscripciones
    });
  } catch (error: any) {
    logger.error('Error al listar suscripciones:', error);
    res.status(500).json({
      mensaje: 'Error al obtener suscripciones'
    });
  }
};

export const cancelar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const suscripcion = await cancelarSuscripcion(id, usuarioId);

    res.status(200).json({
      mensaje: 'Suscripción cancelada exitosamente',
      datos: suscripcion
    });
  } catch (error: any) {
    logger.error('Error al cancelar suscripción:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al cancelar suscripción'
    });
  }
};

export const renovar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosValidados = crearSuscripcionSchema.parse(req.body);
    const suscripcion = await renovarSuscripcion(usuarioId, datosValidados);

    res.status(201).json({
      mensaje: 'Suscripción renovada exitosamente',
      datos: suscripcion
    });
  } catch (error: any) {
    logger.error('Error al renovar suscripción:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al renovar suscripción'
    });
  }
};