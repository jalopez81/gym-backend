import { Router } from "express";
import { actualizarMiPerfil, actualizarUsuario, cambiarMiPassword, listar, usuarioPorId } from "../controladores/usuario.controlador";
import { autenticar, autorizar, ROLES } from "../middlewares/auth.middleware";

const router = Router();

// protegidas
router.get('/:id', autenticar, usuarioPorId);
router.put('/actualizar-perfil', autenticar, actualizarMiPerfil);
router.put('/cambiar-password', autenticar, cambiarMiPassword);

// solo admin
router.get('/', autenticar, autorizar(ROLES.ADMIN), listar);
router.put('/:id', autenticar, actualizarUsuario);

export default router;