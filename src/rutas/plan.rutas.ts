import { Router } from 'express';
import {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
} from '../controladores/plan.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', listar);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', autenticar, autorizar(ROLES.ADMIN), crear);
router.put('/:id', autenticar, autorizar(ROLES.ADMIN), actualizar);
router.delete('/:id', autenticar, autorizar(ROLES.ADMIN), eliminar);

export default router;