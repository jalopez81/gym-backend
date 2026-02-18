import logger from "../config/logger";
import prisma from "../modelos/prisma";
import { compararHash, generarHash } from "../utils/hash";
import { generarToken } from "../utils/jwt";
import { LoginDTO, RegistroDTO } from "../validadores/usuario.validador";
import { enviarEmail } from '../config/mailer';
import {
  templateBienvenida
} from '../utils/emailTemplates';


export const registrarUsuario = async (datos: RegistroDTO) => {
  // Verificar si el email ya existe
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: datos.email }
  });

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
  });

  logger.info(`Usuario registrado: ${usuario.email}`);

  // Enviar email de bienvenida (sin bloquear)
  enviarEmail(
    usuario.email,
    'Bienvenido a nuestro Gimnasio',
    templateBienvenida(usuario.nombre)
  );

  // Generar token
  const token = generarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  });

  return { usuario, token }
};

export const loginUsuario = async (datos: LoginDTO) => {
    logger.warn('Iniciando proceso de autenticación...');

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.email } });
    if (!usuario) { throw new Error('El usuario no existe'); }

    // Verificar contrasena
    const passwordValido = await compararHash(datos.password, usuario.password);
    if (!passwordValido) { throw new Error('La contraseña es inválida.') }

    logger.info(`Usuario verificado exitosamente: ${usuario.email}`)

    // Generar token
    const token = generarToken({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
    });

    return {
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            creado: usuario.creado
        },
        token
    }
};

export const actualizarUsuario = async (
  id: string,
  datos: Partial<RegistroDTO> & { status?: string }
) => {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) throw new Error('Usuario no encontrado');

  let dataActualizada: any = {
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol,
    status: datos.status,
  };

  if (datos.password) {
    dataActualizada.password = await generarHash(datos.password);
  }

  const actualizado = await prisma.usuario.update({
    where: { id },
    data: dataActualizada,
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      status: true,
      creado: true,
    },
  });

  logger.info(`Usuario actualizado: ${actualizado.email}`);
  return actualizado;
};
