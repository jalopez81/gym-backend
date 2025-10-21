import { Router } from "express";
import { actualizarMiPerfil, cambiarMiPassword, listar, miPerfil, usuarioPorId } from "../controladores/usuario.controlador";
import { autenticar, autorizar, ROLES } from "../middlewares/auth.middleware";

const router = Router();

// protegidas
router.get('/:id', autenticar, usuarioPorId);
router.get('/me', autenticar, miPerfil);
router.put('/actualizar-perfil', autenticar, actualizarMiPerfil);
router.put('/cambiar-password', autenticar, cambiarMiPassword);

// solo admin
router.get('/', autenticar, autorizar(ROLES.ADMIN), listar);

export default router;