import prisma from "../modelos/prisma";
import ExcelJS from "exceljs";
import type { EstadoOrden } from "@prisma/client";

/** Órdenes que cuentan como venta para reportes (excluye pendientes y canceladas). */

export async function obtenerReportes(reporte: string, download: boolean = false) {
  switch (reporte) {
    case "ordenes": {
      const ordenes = await prisma.orden.findMany({
        include: { usuario: true },
        orderBy: { creado: "desc" },
      });

      const result = ordenes.map(o => ({
        id: o.id,
        fecha: o.creado,
        cliente: o.usuario.nombre,
        total: o.total,
        estado: o.estado,
      }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Ordenes");

      sheet.columns = [
        { header: "ID", key: "id", width: 12 },
        { header: "Fecha", key: "fecha", width: 20 },
        { header: "Cliente", key: "cliente", width: 20 },
        { header: "Total", key: "total", width: 10 },
        { header: "Estado", key: "estado", width: 15 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "productos": {
      const productos = await prisma.producto.findMany({
        orderBy: { creado: "desc" },
      });

      if (!download) return productos;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Productos");

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nombre", key: "nombre", width: 25 },
        { header: "Precio", key: "precio", width: 12 },
        { header: "Stock", key: "stock", width: 10 },
        { header: "Creado", key: "creado", width: 20 },
      ];

      sheet.addRows(productos);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "suscripciones": {
      const subs = await prisma.suscripcion.findMany({
        include: { usuario: true, plan: true },
        orderBy: { creado: "desc" },
      });

      const result = subs.map(s => ({
        id: s.id,
        cliente: s.usuario.nombre,
        plan: s.plan.nombre,
        precio: s.plan.precio,
        inicio: s.fechaInicio,
        fin: s.fechaVencimiento,
      }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Suscripciones");

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Cliente", key: "cliente", width: 22 },
        { header: "Plan", key: "plan", width: 18 },
        { header: "Precio", key: "precio", width: 10 },
        { header: "Inicio", key: "inicio", width: 18 },
        { header: "Fin", key: "fin", width: 18 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "asistencias": {
      const asistencias = await prisma.asistencia.findMany({
        include: {
          cliente: true,
          sesion: { include: { clase: true } },
        },
        orderBy: { horaEntrada: "desc" },
      });

      const result = asistencias.map(a => ({
        id: a.id,
        horaEntrada: a.horaEntrada,
        cliente: a.cliente.nombre,
        clase: a.sesion.clase.nombre,
        sesion: a.sesion.fechaHora,
      }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Asistencias");

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Fecha", key: "fecha", width: 20 },
        { header: "Cliente", key: "cliente", width: 22 },
        { header: "Clase", key: "clase", width: 22 },
        { header: "Sesion", key: "sesion", width: 22 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "productos-mas-vendidos": {
      const grouped = await prisma.ordenItem.groupBy({
        by: ["productoId"],
        _sum: { cantidad: true, subtotal: true },
        _count: { id: true },
      });

      const sorted = [...grouped].sort(
        (a, b) => (b._sum.cantidad ?? 0) - (a._sum.cantidad ?? 0)
      );

      const productos = await prisma.producto.findMany({
        where: { id: { in: sorted.map((g) => g.productoId) } },
        select: { id: true, nombre: true, categoria: true, precio: true },
      });
      const porId = new Map(productos.map((p) => [p.id, p]));

      const result = sorted.map((g, i) => {
        const p = porId.get(g.productoId);
        return {
          ranking: i + 1,
          productoId: g.productoId,
          nombre: p?.nombre ?? "(sin catálogo)",
          categoria: p?.categoria ?? "",
          precioLista: p?.precio ?? null,
          unidadesVendidas: g._sum.cantidad ?? 0,
          ingresosTotales: g._sum.subtotal ?? 0,
          lineasEnOrdenes: g._count.id,
        };
      });

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Productos más vendidos");

      sheet.columns = [
        { header: "Ranking", key: "ranking", width: 10 },
        { header: "Producto", key: "nombre", width: 28 },
        { header: "Categoría", key: "categoria", width: 18 },
        { header: "Precio lista", key: "precioLista", width: 12 },
        { header: "Unidades vendidas", key: "unidadesVendidas", width: 18 },
        { header: "Ingresos totales", key: "ingresosTotales", width: 16 },
        { header: "Líneas en órdenes", key: "lineasEnOrdenes", width: 18 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "ventas-por-categoria": {
      const items = await prisma.ordenItem.findMany({
        include: {
          producto: { select: { categoria: true } },
        },
      });

      const porCategoria = new Map<
        string,
        { categoria: string; unidadesVendidas: number; ingresosTotales: number }
      >();

      for (const it of items) {
        const cat = it.producto.categoria || "(sin categoría)";
        const cur = porCategoria.get(cat) ?? {
          categoria: cat,
          unidadesVendidas: 0,
          ingresosTotales: 0,
        };
        cur.unidadesVendidas += it.cantidad;
        cur.ingresosTotales += it.subtotal;
        porCategoria.set(cat, cur);
      }

      const result = [...porCategoria.values()]
        .sort((a, b) => b.ingresosTotales - a.ingresosTotales)
        .map((row, i) => ({ ranking: i + 1, ...row }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Ventas por categoría");

      sheet.columns = [
        { header: "Ranking", key: "ranking", width: 10 },
        { header: "Categoría", key: "categoria", width: 22 },
        { header: "Unidades vendidas", key: "unidadesVendidas", width: 18 },
        { header: "Ingresos totales", key: "ingresosTotales", width: 16 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "clases-mas-populares": {
      const [asistencias, reservas] = await Promise.all([
        prisma.asistencia.findMany({
          include: {
            sesion: {
              select: {
                clase: {
                  select: { id: true, nombre: true, capacidad: true },
                },
              },
            },
          },
        }),
        prisma.reserva.findMany({
          include: {
            sesion: {
              select: {
                clase: {
                  select: { id: true, nombre: true, capacidad: true },
                },
              },
            },
          },
        }),
      ]);

      type FilaClase = {
        claseId: string;
        nombre: string;
        capacidad: number;
        totalAsistencias: number;
        totalReservas: number;
      };

      const porClase = new Map<string, FilaClase>();

      for (const a of asistencias) {
        const cl = a.sesion.clase;
        const cur = porClase.get(cl.id) ?? {
          claseId: cl.id,
          nombre: cl.nombre,
          capacidad: cl.capacidad,
          totalAsistencias: 0,
          totalReservas: 0,
        };
        cur.totalAsistencias += 1;
        porClase.set(cl.id, cur);
      }

      for (const r of reservas) {
        const cl = r.sesion.clase;
        const cur = porClase.get(cl.id) ?? {
          claseId: cl.id,
          nombre: cl.nombre,
          capacidad: cl.capacidad,
          totalAsistencias: 0,
          totalReservas: 0,
        };
        cur.totalReservas += 1;
        porClase.set(cl.id, cur);
      }

      const result = [...porClase.values()]
        .sort(
          (a, b) =>
            b.totalAsistencias - a.totalAsistencias ||
            b.totalReservas - a.totalReservas
        )
        .map((row, i) => ({ ranking: i + 1, ...row }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Clases más populares");

      sheet.columns = [
        { header: "Ranking", key: "ranking", width: 10 },
        { header: "Clase", key: "nombre", width: 28 },
        { header: "Capacidad", key: "capacidad", width: 12 },
        { header: "Asistencias", key: "totalAsistencias", width: 14 },
        { header: "Reservas", key: "totalReservas", width: 12 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    case "entrenadores-mas-populares": {
      const [entrenadores, asistencias, reservas, clientesPorEntrenador] =
        await Promise.all([
          prisma.entrenador.findMany({
            include: { usuario: { select: { nombre: true } } },
          }),
          prisma.asistencia.findMany({
            include: {
              sesion: {
                select: {
                  clase: { select: { entrenadorId: true } },
                },
              },
            },
          }),
          prisma.reserva.findMany({
            include: {
              sesion: {
                select: {
                  clase: { select: { entrenadorId: true } },
                },
              },
            },
          }),
          prisma.asignacionEntrenador.groupBy({
            by: ["entrenadorId"],
            where: { activo: true },
            _count: { id: true },
          }),
        ]);

      type FilaEntrenador = {
        entrenadorId: string;
        nombre: string;
        especialidad: string;
        totalAsistencias: number;
        totalReservas: number;
        clientesActivos: number;
      };

      const stats = new Map<string, FilaEntrenador>();
      for (const e of entrenadores) {
        stats.set(e.id, {
          entrenadorId: e.id,
          nombre: e.usuario.nombre,
          especialidad: e.especialidad,
          totalAsistencias: 0,
          totalReservas: 0,
          clientesActivos: 0,
        });
      }

      for (const g of clientesPorEntrenador) {
        const row = stats.get(g.entrenadorId);
        if (row) row.clientesActivos = g._count.id;
      }

      for (const a of asistencias) {
        const row = stats.get(a.sesion.clase.entrenadorId);
        if (row) row.totalAsistencias += 1;
      }

      for (const r of reservas) {
        const row = stats.get(r.sesion.clase.entrenadorId);
        if (row) row.totalReservas += 1;
      }

      const result = [...stats.values()]
        .filter(
          (row) =>
            row.totalAsistencias > 0 ||
            row.totalReservas > 0 ||
            row.clientesActivos > 0
        )
        .sort(
          (a, b) =>
            b.totalAsistencias - a.totalAsistencias ||
            b.totalReservas - a.totalReservas ||
            b.clientesActivos - a.clientesActivos
        )
        .map((row, i) => ({ ranking: i + 1, ...row }));

      if (!download) return result;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Entrenadores más populares");

      sheet.columns = [
        { header: "Ranking", key: "ranking", width: 10 },
        { header: "Entrenador", key: "nombre", width: 24 },
        { header: "Especialidad", key: "especialidad", width: 22 },
        { header: "Asistencias (clases)", key: "totalAsistencias", width: 20 },
        { header: "Reservas (clases)", key: "totalReservas", width: 18 },
        { header: "Clientes PT activos", key: "clientesActivos", width: 20 },
      ];

      sheet.addRows(result);
      sheet.getRow(1).font = { bold: true };

      const buf = await workbook.xlsx.writeBuffer();
      return Buffer.from(buf);
    }

    default:
      throw new Error("Reporte no encontrado");
  }
}
