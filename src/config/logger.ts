import winston from 'winston';
import Transport from 'winston-transport';
import os from 'os'
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class DatadogTransport extends Transport {
  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    try {
      await axios.post(
        'https://http-intake.logs.us5.datadoghq.com/api/v2/logs',
        [
          {
            ddsource: 'nodejs',
            ddtags: 'env:dev,app:gym-backend',
            service: 'gym-backend',
            message: `${info.timestamp || new Date().toISOString()} [${info.level.toUpperCase()}]: ${info.message}`,
            level: info.level,
            attributes: {
              hostname: os.hostname(),
              env: process.env.NODE_ENV,
              ...info
            }
          }
        ],
        {
          headers: {
            'DD-API-KEY': 'd208b1c0e5efca47fc90335ae06deffe',
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (err: any) {
      console.error('Error enviando log a Datadog:', err.response?.data || err.message);
    }


    callback();
  }
}

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
    new DatadogTransport()
  ]
});

export default logger;
