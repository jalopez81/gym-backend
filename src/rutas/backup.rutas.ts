import { Router } from 'express';
import {
  crearBackupManual,
  listarBackups,
  restaurarBackupPorId
} from '../controladores/backup.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas solo para admin
router.post('/manual', autenticar, autorizar(ROLES.ADMIN), crearBackupManual);
router.get('/', autenticar, autorizar(ROLES.ADMIN), listarBackups);
router.post('/:id/restaurar', autenticar, autorizar(ROLES.ADMIN), restaurarBackupPorId);

export default router;