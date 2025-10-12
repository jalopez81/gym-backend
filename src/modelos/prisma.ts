import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
  ],
});

// Log de queries (opcional, para desarrollo)
prisma.$on('query', (e: any) => {
  logger.debug(`Query: ${e.query}`);
});

prisma.$on('error', (e: any) => {
  logger.error(`Error en Prisma: ${e.message}`);
});

export default prisma;