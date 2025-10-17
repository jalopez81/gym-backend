import logger from '../src/config/logger';
import { generarDatosEjemplo } from '../src/utils/generadorDatosEjemplo'

const ejecutar = async () => {
  try {
    logger.info('Iniciando generación de datos de ejemplo...');
    const resultado = await generarDatosEjemplo();
    
    logger.info('=== DATOS GENERADOS ===');
    logger.info(`Usuarios creados: ${resultado.usuariosCreados}`);
    logger.info(`Productos creados: ${resultado.productosCreados}`);
    logger.info(`Entrenadores creados: ${resultado.entrenadoresCreados}`);
    logger.info('=======================');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error durante la generación:', error);
    process.exit(1);
  }
};

ejecutar();