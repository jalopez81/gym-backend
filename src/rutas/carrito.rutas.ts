import { Router } from 'express';
import {
  agregar,
  obtener,
  actualizar,
  eliminar,
  vaciar
} from '../controladores/carrito.controlador';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (usuario autenticado)
router.post('/', autenticar, agregar);
router.get('/', autenticar, obtener);
router.put('/', autenticar, actualizar);
router.delete('/:productoId', autenticar, eliminar);
router.delete('/', autenticar, vaciar);

export default router;