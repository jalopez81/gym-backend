import prisma from "../modelos/prisma";

export async function obtenerReportes() {
  const [ventas, suscripciones, asistencias, entrenadores, productos] = await Promise.all([
    prisma.orden.findMany({ include: { usuario: true }, orderBy: { creado: "desc" } }),
    prisma.suscripcion.findMany({ include: { usuario: true, plan: true } }),
    prisma.asistencia.findMany({ include: { cliente: true, sesion: { include: { clase: true } } } }),
    prisma.entrenador.findMany({ include: { usuario: true, clientes: true } }),
    prisma.producto.findMany(),
  ]);

  return {
    ventas: ventas.map((v: any) => ({
      id: v.id,
      fecha: v.creado,
      cliente: v.usuario?.nombre,
      total: v.total,
      estado: v.estado,
    })),
    // suscripciones: suscripciones.map((s: any) => ({
    //   id: s.id,
    //   usuario: s.usuario?.nombre,
    //   plan: s.plan?.nombre,
    //   estado: s.estado,
    //   fechaVencimiento: s.fechaVencimiento,
    // })),
    // asistencias: asistencias.map((a: any) => ({
    //   id: a.id,
    //   cliente: a.cliente?.nombre,
    //   clase: a.sesion?.clase?.nombre,
    //   fecha: a.sesion?.fechaHora,
    //   estado: a.estado,
    // })),
    // entrenadores: entrenadores.map((e: any) => ({
    //   id: e.id,
    //   nombre: e.usuario?.nombre,
    //   especialidad: e.especialidad,
    //   experiencia: e.experiencia,
    //   clientes: e.clientes?.length ?? 0,
    // })),
    // productos: productos.map((p: any) => ({
    //   id: p.id,
    //   nombre: p.nombre,
    //   categoria: p.categoria,
    //   stock: p.stock,
    //   precio: p.precio,
    // })),
  };
}
