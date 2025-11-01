import express from           'express';
import cors from              'cors';
import dotenv from            'dotenv';
import logger from            './config/logger'
import asistenciaRutas from   './rutas/asistencia.rutas';
import authRutas from         './rutas/auth.rutas'
import backupRutas from       './rutas/backup.rutas';
import carritoRutas from      './rutas/carrito.rutas';
import claseRutas from        './rutas/clase.rutas';
import entrenadorRutas from   './rutas/entrenador.rutas'
import ordenRutas from        './rutas/orden.rutas';
import planRutas from         './rutas/plan.rutas';
import productoRutas from     './rutas/producto.rutas'
import reporteRutas from      './rutas/reporte.rutas';
import reservaRutas from      './rutas/reserva.rutas';
import sesionRutas from       './rutas/sesion.rutas';
import suscripcionRutas from  './rutas/suscripcion.rutas';
import usuarioRutas from      './rutas/usuario.rutas'

import { programarBackupAutomatico } from './servicios/backup.servicio';
import { manejarErrores, rutaNoEncontrada } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.use('/api/asistencias',    asistenciaRutas);
app.use('/api/auth',           authRutas)
app.use('/api/backups',        backupRutas);
app.use('/api/carrito',        carritoRutas);
app.use('/api/clases',         claseRutas);
app.use('/api/entrenadores',   entrenadorRutas);
app.use('/api/ordenes',        ordenRutas);
app.use('/api/planes',         planRutas);
app.use('/api/productos',      productoRutas)
app.use('/api/reportes',       reporteRutas);
app.use('/api/reservas',       reservaRutas);
app.use('/api/sesiones',       sesionRutas);
app.use('/api/suscripciones',  suscripcionRutas);
app.use('/api/usuarios',       usuarioRutas)

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
  // Programar backup automático
  programarBackupAutomatico();

  console.clear();
  logger.info(`*** READY ***: Servidor "src/app.js" corriendo en el puerto ${port}`);
  logger.info(`*** READY ***: Servidor "src/app.js" corriendo en el puerto ${port}`);
  logger.info(`*** READY ***: Servidor "src/app.js" corriendo en el puerto ${port}`);
  logger.info(`*** READY ***: Servidor "src/app.js" corriendo en el puerto ${port}`);
});
