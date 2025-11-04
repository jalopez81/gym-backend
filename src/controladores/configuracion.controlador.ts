import { Request, Response } from 'express';
import {
  obtenerConfiguracion,
  crearConfiguracion,
  actualizarConfiguracion,
} from '../servicios/configuracion.servicio';

export const listarConfiguracion = async (_req: Request, res: Response) => {
  const config = await obtenerConfiguracion();
  if (!config) return res.status(404).json({ mensaje: 'Configuración no encontrada' });
  res.json(config);
};

export const crear = async (req: Request, res: Response) => {
  try {
    const nueva = await crearConfiguracion(req.body);
    res.status(201).json(nueva);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const actualizada = await actualizarConfiguracion(id, req.body);
    res.json(actualizada);
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
};
