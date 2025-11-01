import { Router } from 'express';
import {
  crear,
  obtenerMias,
  listar,
  obtenerPorSesion,
  cancelar
} from '../controladores/reserva.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/sesion/:sesionId', obtenerPorSesion);

// Rutas protegidas
router.post('/:sesionId', autenticar, crear);
router.get('/', autenticar, obtenerMias);
router.delete('/:id', autenticar, cancelar);

// Rutas solo admin
router.get('/admin/todas', autenticar, autorizar(ROLES.ADMIN), listar);

export default router;