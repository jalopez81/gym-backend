import { Router } from 'express';
import {
  crear,
  crearMultiple,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
  obtenerPorClase
} from '../controladores/sesion.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', listar);
router.get('/:id', obtenerPorId);
router.get('/clase/:claseId', obtenerPorClase);

// Rutas protegidas (solo admin)
router.post('/', autenticar, autorizar(ROLES.ADMIN), crear);
router.post('/multiple', autenticar, autorizar(ROLES.ADMIN), crearMultiple);
router.put('/:id', autenticar, autorizar(ROLES.ADMIN), actualizar);
router.delete('/:id', autenticar, autorizar(ROLES.ADMIN), eliminar);

export default router;