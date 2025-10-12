import logger from "../config/logger";
import prisma from "../modelos/prisma";
import { compararHash, generarHash } from "../utils/hash";
import { generarToken } from "../utils/jwt";
import { LoginDTO, RegistroDTO } from "../validadores/usuario.validador";

export const registrarUsuario = async (datos: RegistroDTO) => {
    logger.warn('Iniciando proceso de registro...');

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: datos.email }
    })

    if (usuarioExistente) {
        throw new Error('El email ya está registrado');
    }

    // Encriptar contraseña
    const passwordHash = await generarHash(datos.password);

    // Crear usuario
    const usuario = await prisma.usuario.create({
        data: {
            nombre: datos.nombre,
            email: datos.email,
            password: passwordHash,
            rol: datos.rol || 'cliente'
        },
        select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            creado: true,
        }
    })

    logger.info(`Usuario registrado: ${usuario.email}`);

    // Generar token
    const token = generarToken({
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
    })

    return { usuario, token }

};

export const loginUsuario = async (datos: LoginDTO) => {
    logger.warn('Iniciando proceso de autenticación...');

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.email } });
    if (!usuario) { throw new Error('El usuario no existe'); }

    // Verificar contrasena
    const passwordValido = compararHash(datos.password, usuario.password);
    if (!passwordValido) { throw new Error('La contraseña es inválida.') }

    logger.info(`Usuario verificado exitosamente: ${usuario.email}`)

    // Generar token
    const token = generarToken({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
    });

    return {
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
        },
        token
    }
};