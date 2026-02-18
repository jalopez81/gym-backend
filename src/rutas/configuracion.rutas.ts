import { Router } from 'express';
import { listarConfiguracion, crear, actualizar } from '../controladores/configuracion.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listarConfiguracion);
router.post('/', autenticar, autorizar(ROLES.ADMIN), crear);
router.put('/:id', autenticar, autorizar(ROLES.ADMIN), actualizar);

export default router;
