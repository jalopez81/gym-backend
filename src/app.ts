import express from           'express';
import cors from              'cors';
import dotenv from            'dotenv';
import logger from            './config/logger'
// import { programarBackupAutomatico } from './servicios/backup.servicio';
// import inicializarConfiguracion from './inicializarConfiguracion';

// import asistenciaRutas from   './rutas/asistencia.rutas';
// import authRutas from         './rutas/auth.rutas'
// import backupRutas from       './rutas/backup.rutas';
// import carritoRutas from      './rutas/carrito.rutas';
// import claseRutas from        './rutas/clase.rutas';
// import configuracionRutas from './rutas/configuracion.rutas';
// import entrenadorRutas from   './rutas/entrenador.rutas'
// import devRutas from          './rutas/dev.rutas'
// import ordenRutas from        './rutas/orden.rutas';
// import planRutas from         './rutas/plan.rutas';
// import productoRutas from     './rutas/producto.rutas'
// import reporteRutas from      './rutas/reporte.rutas';
// import reservaRutas from      './rutas/reserva.rutas';
// import sesionRutas from       './rutas/sesion.rutas';
// import suscripcionRutas from  './rutas/suscripcion.rutas';
// import usuarioRutas from      './rutas/usuario.rutas'

import { manejarErrores, rutaNoEncontrada } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// app.use('/api/asistencias',    asistenciaRutas);
// app.use('/api/auth',           authRutas)
// app.use('/api/backups',        backupRutas);
// app.use('/api/carrito',        carritoRutas);
// app.use('/api/clases',         claseRutas);
// app.use('/api/configuracion',  configuracionRutas);
// app.use('/api/entrenadores',   entrenadorRutas);
// app.use('/api/dev',            devRutas);
// app.use('/api/ordenes',        ordenRutas);
// app.use('/api/planes',         planRutas);
// app.use('/api/productos',      productoRutas)
// app.use('/api/reportes',       reporteRutas);
// app.use('/api/reservas',       reservaRutas);
// app.use('/api/sesiones',       sesionRutas);
// app.use('/api/suscripciones',  suscripcionRutas);
// app.use('/api/usuarios',       usuarioRutas)


app.get('/status', (req, res) => {
  logger.info('Status OK');
  res.send('Status OK');
});

app.use(rutaNoEncontrada);
app.use(manejarErrores);

// inicializarConfiguracion();

app.listen(port, () => {  
  // programarBackupAutomatico();
  logger.info(`Servidor listo. Puerto ::: ${port}`);
});
