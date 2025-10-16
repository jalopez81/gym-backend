import { actualizar, crear, eliminar, getPorId, listar } from "../controladores/producto.controlador";
import { Router } from 'express'
import { autenticar, autorizar, ROLES } from "../middlewares/auth.middleware";

const router = Router();

// rutas publicas 
router.get('/', listar);
router.get('/:id', getPorId);

// rutas privadas 
router.post('/crear', autenticar, autorizar(ROLES.ADMIN), crear);
router.delete('/eliminar/:id', autenticar, autorizar(ROLES.ADMIN), eliminar);
router.put('/actualizar/:id', autenticar, autorizar(ROLES.ADMIN), actualizar);

export default router;