import { Router } from 'express';
import {getReportes,} from '../controladores/reporte.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', autenticar, autorizar(ROLES.ADMIN), getReportes);


export default router;
