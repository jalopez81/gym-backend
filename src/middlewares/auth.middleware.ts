import { NextFunction, Request, Response } from "express"
import logger from "../config/logger";
import { verificarToken } from "../utils/jwt";

export const ROLES = {
    ADMIN: 'admin',
    CLIENTE: 'cliente',
    ENTRENADOR: 'entrenador',
    RECEPCIONISTA: 'recepcionista'
}

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: string;
                email: string;
                rol: string;
            }
        }
    }
}

export const autenticar = async (req: Request, res: Response, nextFunc: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'Token no proporcionado'
            });
        }

        const token = authHeader.substring(7)
        const payload = verificarToken(token);

        req.usuario = {
            id: payload.id,
            email: payload.email,
            rol: payload.rol,
        }


        nextFunc();
    } catch (error: any) {
        logger.error(`Error de autenticación: ${error}`)


        return res.status(401).json({
            mensaje: 'Autenticar: Token inválido o expirado'
        });
    }
}

// Middleware para verificar roles específicos
export const autorizar = (...rolesPermitidos: string[]) => {
    return (req: Request, res: Response, nextFunc: NextFunction) => {

        if (!req.usuario) {
            return res.status(401).json({
                mensaje: 'Usuario no autenticado.'
            })
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).send(`El ${req.usuario.rol} ${req.usuario.email} no tiene permiso para ${req.originalUrl}`)
        }

        nextFunc()
    }
}