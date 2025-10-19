import { Router } from 'express';
import {
  crearBackupManual,
  listarBackups,
  restaurarBackupPorId
} from '../controladores/backup.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas solo para admin
router.post('/manual', autenticar, autorizar('admin'), crearBackupManual);
router.get('/', autenticar, autorizar('admin'), listarBackups);
router.post('/:id/restaurar', autenticar, autorizar('admin'), restaurarBackupPorId);

export default router;