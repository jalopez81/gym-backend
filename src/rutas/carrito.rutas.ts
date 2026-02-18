import { Router } from 'express';
import {
  agregar,
  obtener,
  eliminar,
  vaciar
} from '../controladores/carrito.controlador';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (usuario autenticado)
router.post('/', autenticar, agregar);
router.get('/', autenticar, obtener);
router.delete('/:id', autenticar, eliminar);
router.delete('/', autenticar, vaciar);

export default router;