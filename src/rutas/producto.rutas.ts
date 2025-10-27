import { actualizar, crear, eliminar, getPorId, listar } from "../controladores/producto.controlador";
import { Router } from 'express'
import { autenticar, autorizar, ROLES } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// rutas publicas 
router.get('/', listar);
router.get('/:id', getPorId);

// rutas privadas 
router.post('/crear', autenticar, autorizar(ROLES.ADMIN), upload.single("imagen"), crear);
router.delete('/:id', autenticar, autorizar(ROLES.ADMIN), eliminar);
router.put('/actualizar/:id', autenticar, autorizar(ROLES.ADMIN), upload.single("imagen"), actualizar);

export default router;