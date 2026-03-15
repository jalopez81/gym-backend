import { Router } from "express";
import { login, registro, enviarCodigoRegistro } from "../controladores/auth.controlador";
import { miPerfil } from "../controladores/usuario.controlador";
import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.post('/enviar-codigo-registro', enviarCodigoRegistro);
router.post('/registro', registro);
router.post('/login', login);
router.get('/me', autenticar, miPerfil);

export default router;