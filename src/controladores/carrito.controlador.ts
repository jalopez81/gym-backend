import { Request, Response } from 'express';
import {
  agregarAlCarrito,
  obtenerCarrito,
  actualizarItemCarrito,
  eliminarDelCarrito,
  vaciarCarrito
} from '../servicios/carrito.servicio';
import {
  agregarAlCarritoSchema,
  actualizarCarritoSchema
} from '../validadores/carrito.validador';
import logger from '../config/logger';

export const agregar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosValidados = agregarAlCarritoSchema.parse(req.body);
    const carritoItem = await agregarAlCarrito(usuarioId, datosValidados);

    res.status(201).json(carritoItem);
  } catch (error: any) {
    logger.error('Error al agregar al carrito:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al agregar al carrito'
    });
  }
};

export const obtener = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const carrito = await obtenerCarrito(usuarioId);

    res.status(200).json(carrito);
  } catch (error: any) {
    logger.error('Error al obtener carrito:', error);
    res.status(500).json({
      mensaje: 'Error al obtener carrito'
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    
    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosValidados = actualizarCarritoSchema.parse(req.body);
    const carritoItem = await actualizarItemCarrito(usuarioId, datosValidados);

    res.status(200).json(carritoItem);
  } catch (error: any) {
    logger.error('Error al actualizar carrito:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar carrito'
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;
    const { productoId } = req.params;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    await eliminarDelCarrito(usuarioId, productoId);

    res.status(200).json({
      mensaje: 'Producto eliminado del carrito exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar del carrito:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al eliminar del carrito'
    });
  }
};

export const vaciar = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    await vaciarCarrito(usuarioId);

    res.status(200).json({
      mensaje: 'Carrito vaciado exitosamente'
    });
  } catch (error: any) {
    logger.error('Error al vaciar carrito:', error);
    res.status(500).json({
      mensaje: 'Error al vaciar carrito'
    });
  }
};