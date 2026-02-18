import jwt from 'jsonwebtoken';
import logger from '../config/logger';

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro-cambiar-en-produccion';

export const generarToken = (payload: object): string => {
  try {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
  } catch (error) {
    logger.error('Error al generar token', error);
    throw new Error('Error al generar token');
  }
};

export const verificarToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    logger.error('Error al verificar token', error);
    throw new Error('verificarToken: Token inválido o expirado');
  }
};