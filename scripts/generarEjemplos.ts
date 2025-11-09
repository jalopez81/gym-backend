import logger from '../src/config/logger';
import { generarDatosEjemplo } from '../src/utils/generadorDatosEjemplo'

const ejecutar = async () => {
  try {
    logger.info('Iniciando generación de datos de ejemplo...');
    const resultado = await generarDatosEjemplo();
    
    logger.info('=== DATOS GENERADOS ===');
    for(const [clave, valor] of Object.entries(resultado)) {
      logger.info(`${clave}: ${valor}`);
    }
    
    logger.info('=======================');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error durante la generación:', error);
    process.exit(1);
  }
};

ejecutar();