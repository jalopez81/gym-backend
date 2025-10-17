import { Router } from 'express';
import {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
  asignarCliente,
  desasignarCliente
} from '../controladores/entrenador.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas (listar entrenadores)
router.get('/', listar);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', autenticar, autorizar(ROLES.ADMIN), crear);
router.put('/:id', autenticar, autorizar(ROLES.ADMIN), actualizar);
router.delete('/:id', autenticar, autorizar(ROLES.ADMIN), eliminar);

// Asignaciones de clientes (solo admin)
router.post('/asignar/cliente', autenticar, autorizar(ROLES.ADMIN), asignarCliente);
router.post('/desasignar/cliente', autenticar, autorizar(ROLES.ADMIN), desasignarCliente);

export default router;