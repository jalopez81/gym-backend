import logger from "../config/logger";
import prisma from "../modelos/prisma"
import { compararHash, generarHash } from "../utils/hash";
import { ActualizarPerfilDTO, CambiarPasswordDTO } from "../validadores/usuario.actualizar.validador";

export const getUsuarios = async () => {
    const usuarios = await prisma.usuario.findMany({
        select: {
            email: true,
            nombre: true,
            rol: true,
            creado: true,
        },
        orderBy: { nombre: 'asc' }
    })

    return usuarios;
}

export const obtenerUsuarioPorId = async (id: string) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id }
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado.')
    }

    return usuario;
}

export const actuarlizarPerfil = async (id: string, datos: ActualizarPerfilDTO) => {
    // verificar si email ya esta en uso
    if (datos.email) {
        const emailExiste = await prisma.usuario.findUnique({ where: { email: datos.email } });

        if (emailExiste && emailExiste.id !== id) {
            throw new Error('Este email ya está en uso.')
        }
    }

    // actualizar
    const usuario = await prisma.usuario.update({
        where: { id },
        data: datos
    });

    logger.info(`Perfil actualizado: ${usuario.email}`)
    return usuario;
}

export const cambiarPassword = async (id: string, datos: CambiarPasswordDTO) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id }
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const passwordValido = await compararHash(datos.passwordActual, usuario.password);
    if (!passwordValido) { throw new Error('La contraseña es inválida.') }

    const nuevoHash = await generarHash(datos.passwordNuevo);

    await prisma.usuario.update({
        where: { id },
        data: { password: nuevoHash }
    })

    logger.info(`El password ha sido actualizado: ${usuario.email}`)
}