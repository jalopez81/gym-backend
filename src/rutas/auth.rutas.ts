import { Router } from "express";
import { login, registro } from "../controladores/auth.controlador";
import { miPerfil } from "../controladores/usuario.controlador";
import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/me', autenticar, miPerfil);

export default router;