import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    // Logs en consola
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
      level: 'error' 
    }),
    // Logs en archivo (errores)
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Logs en archivo (todo)
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

export default logger;