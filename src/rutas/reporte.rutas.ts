import { Router } from 'express';
import {getReportes,} from '../controladores/reporte.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:reporte_name/', autenticar, autorizar(ROLES.ADMIN), getReportes);
router.get('/:reporte_name/:download', autenticar, autorizar(ROLES.ADMIN), getReportes);


export default router;
