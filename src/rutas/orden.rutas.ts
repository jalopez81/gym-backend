import { Router } from 'express';
import {
  crear,
  obtenerMias,
  obtenerPorId,
  listar,
  completar,
  cancelar
} from '../controladores/orden.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (usuario autenticado)
router.post('/', autenticar, crear);
router.get('/mis-ordenes', autenticar, obtenerMias);
router.get('/:id', autenticar, obtenerPorId);
router.post('/:id/completar', autenticar, completar);
router.post('/:id/cancelar', autenticar, cancelar);

// Rutas solo admin
router.get('/', autenticar, autorizar('admin'), listar);

export default router;