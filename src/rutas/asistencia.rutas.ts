import { Router } from 'express';
import {
  crear,
  obtenerPorSesion,
  obtenerMiHistorial,
  listar,
  obtenerEstadisticas
} from '../controladores/asistencia.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas
router.post('/', autenticar, crear);
router.get('/mi-historial', autenticar, obtenerMiHistorial);
router.get('/estadisticas/:clienteId', autenticar, obtenerEstadisticas);

// Rutas solo admin
router.get('/sesion/:sesionId', autenticar, autorizar('admin', 'entrenador'), obtenerPorSesion);

export default router;