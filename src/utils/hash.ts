import bcrypt from 'bcrypt';
import logger from '../config/logger';

const SALT_ROUNDS = 10;

export const generarHash = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error('Error al generar hash', error);
    throw new Error('Error al encriptar contraseña');
  }
};

export const compararHash = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error al comparar hash', error);
    throw new Error('Error al verificar contraseña');
  }
};