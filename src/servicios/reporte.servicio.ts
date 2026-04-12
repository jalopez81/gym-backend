import prisma from "../modelos/prisma";
import ExcelJS from "exceljs";
import type { EstadoOrden } from "@prisma/client";

/** Órdenes que cuentan como venta para reportes (excluye pendientes y canceladas). */
const ESTADOS_VENTA: EstadoOrden[] = ["COMPLETADA", "PAGADA", "ENVIADA"];

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
      
      console.log(productos)
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

    default:
      throw new Error("Reporte no encontrado");
  }
}
