import { Router } from 'express';
import {
  crear,
  obtener,   // nombre claro
  listar,
  cancelar,                // cambia estado a CANCELADA
  renovar,
  actualizar
} from '../controladores/suscripcion.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas usuario autenticado
router.post('/', autenticar, crear);                       // crear nueva suscripción
router.get('/mi-suscripcion', autenticar, obtener); // obtener la propia
router.patch('/:id/cancelar', autenticar, cancelar);       // cancelar (soft) => PATCH
router.post('/:id/renovar', autenticar, renovar);          // renovar (crea nueva/extend)
router.patch('/:id', actualizar)


// Rutas admin
router.get('/', autenticar, autorizar(ROLES.ADMIN), listar); // listar todas

export default router;
