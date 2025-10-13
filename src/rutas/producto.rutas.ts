import { actualizar, crear, eliminar, getPorId, listar } from "../controladores/producto.controlador";
import { Router } from 'express'
import { autenticar, autorizar } from "../middlewares/auth.middleware";

const router = Router();

// rutas publicas 
router.get('/', listar);
router.get('/:id', getPorId);

// rutas privadas 
router.post('/crear', autenticar, autorizar('admin'), crear);
router.delete('/eliminar/:id', autenticar, autorizar('admin'), eliminar);
router.put('/actualizar/:id', autenticar, autorizar('admin'), actualizar);

export default router;