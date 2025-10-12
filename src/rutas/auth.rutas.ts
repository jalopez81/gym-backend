import { Router } from "express";
import { login, registro } from "../controladores/auth.controlador";

const router = Router();

router.post('/registro', registro);
router.post('/login', login);

export default router;