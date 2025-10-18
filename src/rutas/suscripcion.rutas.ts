import { Router } from 'express';
import {
  crear,
  obtenerMia,
  listar,
  cancelar,
  renovar
} from '../controladores/suscripcion.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (usuario autenticado)
router.post('/', autenticar, crear);
router.get('/mi-suscripcion', autenticar, obtenerMia);
router.delete('/:id', autenticar, cancelar);
router.post('/:id/renovar', autenticar, renovar);

// Rutas solo admin
router.get('/', autenticar, autorizar('admin'), listar);

export default router;