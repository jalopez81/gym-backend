import { Router } from "express";
import { actualizarMiPerfil, cambiarMiPassword, listar, obtenerPerfil } from "../controladores/usuario.controlador";
import { autenticar, autorizar, ROLES } from "../middlewares/auth.middleware";

const router = Router();

// protegidas
router.get('/:id', autenticar, obtenerPerfil);
router.put('/actualizar-perfil', autenticar, actualizarMiPerfil);
router.put('/cambiar-password', autenticar, cambiarMiPassword);

// solo admin
router.get('/', autenticar, autorizar(ROLES.ADMIN), listar);

export default router;