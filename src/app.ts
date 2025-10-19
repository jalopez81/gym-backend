import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './config/logger'
import authRutas from './rutas/auth.rutas'
import productoRutas from './rutas/producto.rutas'
import usuarioRutas from './rutas/usuario.rutas'
import entrenadorRutas from './rutas/entrenador.rutas'
import claseRutas from './rutas/clase.rutas';
import sesionRutas from './rutas/sesion.rutas';
import reservaRutas from './rutas/reserva.rutas';
import planRutas from './rutas/plan.rutas';
import suscripcionRutas from './rutas/suscripcion.rutas';
import asistenciaRutas from './rutas/asistencia.rutas';
import carritoRutas from './rutas/carrito.rutas';
import ordenRutas from './rutas/orden.rutas';

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
app.use('/api/clases', claseRutas);
app.use('/api/sesiones', sesionRutas);
app.use('/api/reservas', reservaRutas);
app.use('/api/planes', planRutas);
app.use('/api/suscripciones', suscripcionRutas);
app.use('/api/asistencia', asistenciaRutas);
app.use('/api/carrito', carritoRutas);
app.use('/api/ordenes', ordenRutas);

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
