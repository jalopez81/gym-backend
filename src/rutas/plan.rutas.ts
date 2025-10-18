import { Router } from 'express';
import {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
} from '../controladores/plan.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', listar);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', autenticar, autorizar('admin'), crear);
router.put('/:id', autenticar, autorizar('admin'), actualizar);
router.delete('/:id', autenticar, autorizar('admin'), eliminar);

export default router;