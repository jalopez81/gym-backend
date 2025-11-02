import { Request, Response } from "express";
import { obtenerUsuarioPorId, getUsuarios, actuarlizarPerfil, cambiarPassword } from "../servicios/usuario.servicio";
import logger from "../config/logger";
import { actualizarPerfilSchema, cambiarPasswordSchema } from "../validadores/usuario.actualizar.validador";
import { ROLES } from "../middlewares/auth.middleware";

export const listar = async (req: Request, res: Response) => {
    try {
        const usuarios = await getUsuarios();
        res.status(200).json(usuarios);
    } catch (error: any) {
        logger.error(`Ha ocurrido un error: ${error}`)
        res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            datos: error
        })

    }
}

export const miPerfil = async (req: Request, res: Response) => {
    try {
        const id = req.usuario?.id;
        
        if (!id) {
            return res.status(401).json({
                mensaje: 'No autenticado'
            });
        }

        const obj  = await obtenerUsuarioPorId(id)        
        const usuario = {
            nombre: obj.nombre,
            rol: obj.rol,
            email: obj.email,
            id: obj.id,
            creado: obj.creado,
        };
        
        

        
        res.status(200).json(usuario)
        
    } catch (error:any) {
        res.status(401).json({
            mensaje: 'Hubo un error al obtener el perfil',
            datos: error.message
        })
        
    }

}

export const usuarioPorId = async (req: Request, res: Response) => {
    try {
        const id = req.usuario?.id;

        if (!id) {
            return res.status(401).json({
                mensaje: 'No autenticado'
            });
        }

        if(id !== req.params.id && req.usuario?.rol !== ROLES.ADMIN){
            return res.status(401).json({
                mensaje: 'No está autorizado a ver este perfil'
            })
        }

        const usuario = await obtenerUsuarioPorId(req.params.id)
        res.status(200).json(usuario)
    } catch (error: any) {
        logger.error('Error al obtener perfil:', error);
        res.status(404).json({
            mensaje: error.message || 'Usuario no encontrado'
        });
    }
}

export const actualizarMiPerfil = async (req: Request, res: Response) => {
    try {
        const id = req.usuario?.id;

        if(!id){
            return res.status(401).json({
                mensaje: 'No autenticado'
            })
        }

        const datosValidados = actualizarPerfilSchema.parse(req.body);
        const usuario = await actuarlizarPerfil(id, datosValidados);

        res.status(200).json(usuario)
        

    } catch (error: any) {
        logger.error(`Ha ocurrido un error: ${error}`)
        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: error.issues
            })
        }

        res.status(500).json({
            message: 'Ha ocurrido un error',
            data: error
        })

    }
}

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const datosValidados = actualizarPerfilSchema.parse(req.body);

    const usuario = await actuarlizarPerfil(id, datosValidados);

    res.status(200).json(usuario);
  } catch (error: any) {
    logger.error(`Error al actualizar usuario: ${error}`);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.issues,
      });
    }

    res.status(500).json({
      message: 'Error al actualizar usuario',
      data: error.message,
    });
  }
};


export const cambiarMiPassword = async (req: Request, res: Response) => {
    try {
        const id = req.usuario?.id;

        if(!id){
            return res.status(401).json({
                mensaje: 'No autenticado'
            })
        }

        const datosValidados = cambiarPasswordSchema.parse(req.body);
        await cambiarPassword(id, datosValidados);

        res.status(200).json({
            mensaje: 'Contraseña cambiada exitosamente',
        })
        

    } catch (error: any) {
        logger.error(`Ha ocurrido un error: ${error}`)
        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: error.issues
            })
        }

        res.status(500).json({
            message: 'Ha ocurrido un error',
            data: error
        })

    }
}
