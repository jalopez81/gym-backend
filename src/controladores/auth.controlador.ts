import { Request, Response } from "express";
import logger from "../config/logger";
import { loginSchema, registroSchema } from "../validadores/usuario.validador"
import { enviarCodigo, loginUsuario, registrarUsuario } from "../servicios/auth.servicio";

export const registro = async (req: Request, res: Response) => {
    try {
        const credenciales = req.body;
        const credencialesValidadas = registroSchema.parse(credenciales)

        const resultado = await registrarUsuario(credencialesValidadas);

        return res.status(201).json(resultado)

    } catch (error: any) {
        logger.error(`Error de registro: ${error}`)

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errores: error.issues
            })
        }
        return res.status(400).json({
            mensaje: error.message || 'Error al registrar usuario'
        });
    }
}

export const enviarCodigoRegistro = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const codigoGeneradoHash = await enviarCodigo(email);                

        return res.status(200).json({
            mensaje: 'Código enviado exitosamente',
            codigoGeneradoHash
        })
    } catch (error: any) {
        logger.error(`Error al enviar código de registro: ${error}`)
        return res.status(500).json({
            mensaje: error.message || 'Error al enviar código de registro'
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const credenciales = req.body;
        const credencialesValidadas = loginSchema.parse(credenciales)

        const resultado = await loginUsuario(credencialesValidadas);

        return res.status(200).json(resultado)


    } catch (error: any) {
        logger.error(`Error de autenticación: ${error}`)

        if (error.name === 'ZodError') {
            return res.status(401).json({
                message: 'Datos inválidos',
                errores: error.issues
            })
        }

        return res.status(401).json({
            mensaje: error.message || 'Error al iniciar sesión'
        });
    }
}
