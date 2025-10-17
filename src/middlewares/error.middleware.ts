import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const manejarErrores = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error no manejado:', err);

  // Error de validación de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      mensaje: 'El registro ya existe',
      error: err.meta?.target
    });
  }

  // Error de registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      mensaje: 'Registro no encontrado'
    });
  }

  // Error genérico
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware para rutas no encontradas
export const rutaNoEncontrada = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.path}`
  });
};