import { Request, Response } from 'express';
import {
  crearEntrenador,
  obtenerEntrenadores,
  obtenerEntrenadorPorId,
  actualizarEntrenador,
  eliminarEntrenador,
  asignarClienteAEntrenador,
  desasignarClienteDeEntrenador
} from '../servicios/entrenador.servicio';
import {
  crearEntrenadorSchema,
  actualizarEntrenadorSchema
} from '../validadores/entrenador.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const datosValidados = crearEntrenadorSchema.parse(req.body);
    const entrenador = await crearEntrenador(datosValidados);

    res.status(201).json({
      mensaje: 'Entrenador creado exitosamente',
      datos: entrenador
    });
  } catch (error: any) {
    logger.error('Error al crear entrenador:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear entrenador'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const entrenadores = await obtenerEntrenadores();

    res.status(200).json(entrenadores);
  } catch (error: any) {
    logger.error('Error al listar entrenadores:', error);
    res.status(500).json({
      mensaje: 'Error al obtener entrenadores'
    });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entrenador = await obtenerEntrenadorPorId(id);

    res.status(200).json(entrenador);
  } catch (error: any) {
    logger.error('Error al obtener entrenador:', error);
    res.status(404).json({
      mensaje: error.message || 'Entrenador no encontrado'
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datosValidados = actualizarEntrenadorSchema.parse(req.body);
    const entrenador = await actualizarEntrenador(id, datosValidados);

    res.status(200).json({
      mensaje: 'Entrenador actualizado exitosamente',
      datos: entrenador
    });
  } catch (error: any) {
    logger.error('Error al actualizar entrenador:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar entrenador'
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eliminarEntrenador(id);

    res.status(200).json({
      mensaje: 'Entrenador eliminado exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar entrenador:', error);
    res.status(404).json({
      mensaje: error.message || 'Entrenador no encontrado'
    });
  }
};

export const asignarCliente = async (req: Request, res: Response) => {
  try {
    const { entrenadorId, clienteId } = req.body;

    if (!entrenadorId || !clienteId) {
      return res.status(400).json({
        mensaje: 'Faltan entrenadorId o clienteId'
      });
    }

    await asignarClienteAEntrenador(entrenadorId, clienteId);

    res.status(200).json({
      mensaje: 'Cliente asignado al entrenador exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al asignar cliente:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al asignar cliente'
    });
  }
};

export const desasignarCliente = async (req: Request, res: Response) => {
  try {
    const { entrenadorId, clienteId } = req.body;

    if (!entrenadorId || !clienteId) {
      return res.status(400).json({
        mensaje: 'Faltan entrenadorId o clienteId'
      });
    }

    await desasignarClienteDeEntrenador(entrenadorId, clienteId);

    res.status(200).json({
      mensaje: 'Cliente desasignado del entrenador exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al desasignar cliente:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al desasignar cliente'
    });
  }
};