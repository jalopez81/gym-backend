import prisma from "../../modelos/prisma";

export async function verificarSesion(sesionId: string) {
  const sesion = await prisma.sesion.findUnique({
    where: { id: sesionId },
    include: { clase: true },
  });
  if (!sesion) throw new Error('Sesión no encontrada');
  return sesion;
}

export async function verificarCliente(clienteId: string) {
  const cliente = await prisma.usuario.findUnique({ where: { id: clienteId } });
  if (!cliente) throw new Error('Cliente no encontrado');
  return cliente;
}

export async function verificarReserva(clienteId: string, sesionId: string) {
  const reserva = await prisma.reserva.findFirst({
    where: { clienteId, sesionId },
  });
  if (!reserva) throw new Error('El cliente no tiene reserva en esta sesión');
}

export async function verificarAsistenciaDuplicada(clienteId: string, sesionId: string) {
  const existente = await prisma.asistencia.findFirst({
    where: { clienteId, sesionId },
  });
  if (existente) throw new Error('La asistencia ya ha sido marcada para este cliente en esta sesión');
}
