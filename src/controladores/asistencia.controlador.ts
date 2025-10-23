import { Request, Response } from 'express';
import {
  marcarAsistencia,
  obtenerAsistenciasPorSesion,
  obtenerMiHistorialAsistencia,
  obtenerTodasLasAsistencias,
  obtenerEstadisticasUsuario
} from '../servicios/asistencia.servicio';
import { crearAsistenciaSchema } from '../validadores/asistencia.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const datosValidados = crearAsistenciaSchema.parse(req.body);
    const asistencia = await marcarAsistencia(datosValidados);

    res.status(201).json(asistencia);
  } catch (error: any) {
    logger.error('Error al marcar asistencia:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al marcar asistencia'
    });
  }
};

export const obtenerPorSesion = async (req: Request, res: Response) => {
  try {
    const { sesionId } = req.params;
    const asistencias = await obtenerAsistenciasPorSesion(sesionId);

    res.status(200).json(asistencias);
  } catch (error: any) {
    logger.error('Error al obtener asistencias:', error);
    res.status(404).json({
      mensaje: error.message || 'Sesión no encontrada'
    });
  }
};

export const obtenerMiHistorial = async (req: Request, res: Response) => {
  try {
    const clienteId = req.usuario?.id;

    if (!clienteId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const asistencias = await obtenerMiHistorialAsistencia(clienteId);

    res.status(200).json(asistencias);
  } catch (error: any) {
    logger.error('Error al obtener historial:', error);
    res.status(500).json({
      mensaje: 'Error al obtener historial'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const asistencias = await obtenerTodasLasAsistencias();

    res.status(200).json(asistencias);
  } catch (error: any) {
    logger.error('Error al listar asistencias:', error);
    res.status(500).json({
      mensaje: 'Error al obtener asistencias'
    });
  }
};

export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const estadisticas = await obtenerEstadisticasUsuario(clienteId);

    res.status(200).json(estadisticas);
  } catch (error: any) {
    logger.error('Error al obtener estadísticas:', error);
    res.status(404).json({
      mensaje: error.message || 'Usuario no encontrado'
    });
  }
};