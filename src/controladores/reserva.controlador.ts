import { Request, Response } from 'express';
import {
  crearReserva,
  obtenerMisReservas,
  obtenerTodasLasReservas,
  obtenerReservasPorSesion,
  cancelarReserva
} from '../servicios/reserva.servicio';
import { crearReservaSchema } from '../validadores/reserva.validador';
import logger from '../config/logger';

export const crear = async (req: Request, res: Response) => {
  try {
    const clienteId = req.usuario?.id;

    if (!clienteId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const datosValidados = crearReservaSchema.parse(req.body);
    const reserva = await crearReserva(clienteId, datosValidados);

    res.status(201).json({
      mensaje: 'Reserva creada exitosamente',
      datos: reserva
    });
  } catch (error: any) {
    logger.error('Error al crear reserva:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: error.errors
      });
    }

    res.status(400).json({
      mensaje: error.message || 'Error al crear reserva'
    });
  }
};

export const obtenerMias = async (req: Request, res: Response) => {
  try {
    const clienteId = req.usuario?.id;

    if (!clienteId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const reservas = await obtenerMisReservas(clienteId);

    res.status(200).json({
      mensaje: 'Mis reservas obtenidas exitosamente',
      datos: reservas
    });
  } catch (error: any) {
    logger.error('Error al obtener mis reservas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reservas'
    });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const reservas = await obtenerTodasLasReservas();

    res.status(200).json({
      mensaje: 'Reservas obtenidas exitosamente',
      datos: reservas
    });
  } catch (error: any) {
    logger.error('Error al listar reservas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reservas'
    });
  }
};

export const obtenerPorSesion = async (req: Request, res: Response) => {
  try {
    const { sesionId } = req.params;
    const reservas = await obtenerReservasPorSesion(sesionId);

    res.status(200).json({
      mensaje: 'Reservas de la sesión obtenidas exitosamente',
      datos: reservas
    });
  } catch (error: any) {
    logger.error('Error al obtener reservas de la sesión:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reservas'
    });
  }
};

export const cancelar = async (req: Request, res: Response) => {
  try {
    const clienteId = req.usuario?.id;
    const { id } = req.params;

    if (!clienteId) {
      return res.status(401).json({
        mensaje: 'No autenticado'
      });
    }

    const reserva = await cancelarReserva(id, clienteId);

    res.status(200).json({
      mensaje: 'Reserva cancelada exitosamente',
      datos: reserva
    });
  } catch (error: any) {
    logger.error('Error al cancelar reserva:', error);
    res.status(400).json({
      mensaje: error.message || 'Error al cancelar reserva'
    });
  }
};