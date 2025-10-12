import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './config/logger'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// status
app.get('/status', (req, res) => {
  logger.info('Status OK');
  res.send('OK');
});

// iniciar
app.listen(port, () => {
  logger.info(`Servidor corriendo en el puerto ${port}`);
});
