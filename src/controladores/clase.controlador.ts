import { Request, Response } from 'express';
import {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase
} from '../servicios/clase.servicio';
import {
  crearClaseSchema,
  actualizarClaseSchema
} from '../validadores/clase.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const datosValidados = crearClaseSchema.parse(req.body);
    const clase = await crearClase(datosValidados);

    res.status(201).json(clase);
  } catch (error: any) {
    logger.error('Error al crear clase:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear clase'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const clases = await obtenerClases();

    res.status(200).json(clases);
  } catch (error: any) {
    logger.error('Error al listar clases:', error);
    res.status(500).json({
      mensaje: 'Error al obtener clases'
    });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clase = await obtenerClasePorId(id);

    res.status(200).json(clase);
  } catch (error: any) {
    logger.error('Error al obtener clase:', error);
    res.status(404).json({
      mensaje: error.message || 'Clase no encontrada'
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datosValidados = actualizarClaseSchema.parse(req.body);
    const clase = await actualizarClase(id, datosValidados);

    res.status(200).json(clase);
  } catch (error: any) {
    logger.error('Error al actualizar clase:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar clase'
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eliminarClase(id);

    res.status(200).json({
      mensaje: 'Clase eliminada exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar clase:', error);
    res.status(404).json({
      mensaje: error.message || 'Clase no encontrada'
    });
  }
};