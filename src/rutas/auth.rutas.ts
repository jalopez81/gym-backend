import { Router } from "express";
import { login, registro, listar } from "../controladores/auth.controlador";

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/usuarios', listar);

export default router;