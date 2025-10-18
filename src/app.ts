import '../tracer.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './config/logger'
import authRutas from './rutas/auth.rutas'
import productoRutas from './rutas/producto.rutas'
import usuarioRutas from './rutas/usuario.rutas'
import entrenadorRutas from './rutas/entrenador.rutas'
import { manejarErrores, rutaNoEncontrada } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRutas)
app.use('/api/productos', productoRutas)
app.use('/api/usuarios', usuarioRutas)
app.use('/api/entrenadores', entrenadorRutas);

// Manejo de errores
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// status
app.get('/status', (req, res) => {
  logger.info('Status OK');
  res.send('Status OK');
});

// iniciar
app.listen(port, () => {
  logger.info(`Servidor "src/app.js" corriendo en el puerto ${port}`);
});
