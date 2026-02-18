import { Router } from 'express';
import {
  crear,
  obtenerPorSesion,
  obtenerMiHistorial,
  listar,
  obtenerEstadisticas
} from '../controladores/asistencia.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas
router.post('/', autenticar, crear);
router.get('/', autenticar, obtenerMiHistorial);
router.get('/estadisticas/:clienteId', autenticar, obtenerEstadisticas);

// Rutas solo admin
router.post('/', autenticar, autorizar(ROLES.ADMIN, ROLES.ENTRENADOR), listar);
router.get('/sesion/:sesionId', autenticar, autorizar(ROLES.ADMIN, ROLES.ENTRENADOR), obtenerPorSesion);

export default router;