import { Router } from 'express';
import {
  crearBackupManual,
  listarBackups,
  restaurarBackupPorId,
  eliminarBackupPorId,
  
} from '../controladores/backup.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas solo para admin
router.post('/manual', autenticar, autorizar(ROLES.ADMIN), crearBackupManual);
router.get('/', autenticar, autorizar(ROLES.ADMIN), listarBackups);
router.post('/:id/restaurar', autenticar, autorizar(ROLES.ADMIN), restaurarBackupPorId);
router.delete('/:id/eliminar', autenticar, autorizar(ROLES.ADMIN), eliminarBackupPorId);

export default router;