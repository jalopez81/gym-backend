import prisma from "../modelos/prisma";
import ExcelJS from "exceljs";

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

    default:
      throw new Error("Reporte no encontrado");
  }
}
