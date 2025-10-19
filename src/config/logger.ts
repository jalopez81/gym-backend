import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config();


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
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),
  ]
});

export default logger;
