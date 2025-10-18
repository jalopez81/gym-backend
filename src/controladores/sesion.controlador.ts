import { Request, Response } from 'express';
import {
  crearSesion,
  obtenerSesiones,
  obtenerSesionPorId,
  actualizarSesion,
  eliminarSesion,
  obtenerSesionesPorClase
} from '../servicios/sesion.servicio';
import {
  crearSesionSchema,
  actualizarSesionSchema
} from '../validadores/sesion.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const datosValidados = crearSesionSchema.parse(req.body);
    const sesion = await crearSesion(datosValidados);

    res.status(201).json({
      mensaje: 'Sesión creada exitosamente',
      datos: sesion
    });
  } catch (error: any) {
    logger.error('Error al crear sesión:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear sesión'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const sesiones = await obtenerSesiones();

    res.status(200).json({
      mensaje: 'Sesiones obtenidas exitosamente',
      datos: sesiones
    });
  } catch (error: any) {
    logger.error('Error al listar sesiones:', error);
    res.status(500).json({
      mensaje: 'Error al obtener sesiones'
    });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sesion = await obtenerSesionPorId(id);

    res.status(200).json({
      mensaje: 'Sesión obtenida exitosamente',
      datos: sesion
    });
  } catch (error: any) {
    logger.error('Error al obtener sesión:', error);
    res.status(404).json({
      mensaje: error.message || 'Sesión no encontrada'
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datosValidados = actualizarSesionSchema.parse(req.body);
    const sesion = await actualizarSesion(id, datosValidados);

    res.status(200).json({
      mensaje: 'Sesión actualizada exitosamente',
      datos: sesion
    });
  } catch (error: any) {
    logger.error('Error al actualizar sesión:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar sesión'
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eliminarSesion(id);

    res.status(200).json({
      mensaje: 'Sesión eliminada exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar sesión:', error);
    res.status(404).json({
      mensaje: error.message || 'Sesión no encontrada'
    });
  }
};

export const obtenerPorClase = async (req: Request, res: Response) => {
  try {
    const { claseId } = req.params;
    const sesiones = await obtenerSesionesPorClase(claseId);

    res.status(200).json({
      mensaje: 'Sesiones de la clase obtenidas exitosamente',
      datos: sesiones
    });
  } catch (error: any) {
    logger.error('Error al obtener sesiones de la clase:', error);
    res.status(500).json({
      mensaje: 'Error al obtener sesiones'
    });
  }
};