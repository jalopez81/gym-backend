import { Request, Response } from 'express';
import {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenPorId,
  obtenerTodasLasOrdenes,
  completarOrden,
  cancelarOrden
} from '../servicios/orden.servicio';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const orden = await crearOrden(usuarioId);

    res.status(201).json(orden);
  } catch (error: any) {
    logger.error('Error al crear orden:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al crear orden'
    });
  }
};

export const obtenerMias = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const ordenes = await obtenerMisOrdenes(usuarioId);

    res.status(200).json(ordenes);
  } catch (error: any) {
    logger.error('Error al obtener órdenes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener órdenes'
    });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const id = req.params.id as string;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const orden = await obtenerOrdenPorId(id as string, usuarioId);

    res.status(200).json(orden);
  } catch (error: any) {
    logger.error('Error al obtener orden:', error);
    res.status(404).json({
      mensaje: error.message || 'Orden no encontrada'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const ordenes = await obtenerTodasLasOrdenes();

    res.status(200).json(ordenes);
  } catch (error: any) {
    logger.error('Error al listar órdenes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener órdenes'
    });
  }
};

export const completar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const id = req.params.id as string;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const orden = await completarOrden(id as string, usuarioId);

    res.status(200).json(orden);
  } catch (error: any) {
    logger.error('Error al completar orden:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al completar orden'
    });
  }
};

export const cancelar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const id = req.params.id as string;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const orden = await cancelarOrden(id as string, usuarioId);

    res.status(200).json(orden);
  } catch (error: any) {
    logger.error('Error al cancelar orden:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al cancelar orden'
    });
  }
};