import prisma from '../modelos/prisma';
import ExcelJS from 'exceljs';
import logger from '../config/logger';

const crearEstiloCabecera = (worksheet: ExcelJS.Worksheet, fila: number) => {
  const row = worksheet.getRow(fila);
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } };
  row.alignment = { horizontal: 'center', vertical: 'middle' };
};

export const generarReporteUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { creado: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    // Encabezados
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Rol', key: 'rol', width: 15 },
      { header: 'Fecha Creación', key: 'creado', width: 18 }
    ];

    crearEstiloCabecera(worksheet, 1);

    // Datos
    usuarios.forEach(usuario => {
      worksheet.addRow({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        creado: usuario.creado.toLocaleDateString('es-ES')
      });
    });

    worksheet.columns.forEach(column => {
      column.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    logger.info('Reporte de usuarios generado');
    return workbook;
  } catch (error) {
    logger.error('Error al generar reporte de usuarios:', error);
    throw error;
  }
};

export const generarReporteProductos = async () => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { creado: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Categoría', key: 'categoria', width: 15 },
      { header: 'Precio', key: 'precio', width: 12 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Valor Total', key: 'valorTotal', width: 15 }
    ];

    crearEstiloCabecera(worksheet, 1);

    let totalInventario = 0;

    productos.forEach(producto => {
      const valorTotal = producto.precio * producto.stock;
      totalInventario += valorTotal;

      worksheet.addRow({
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: `$${producto.precio.toFixed(2)}`,
        stock: producto.stock,
        valorTotal: `$${valorTotal.toFixed(2)}`
      });
    });

    // Fila de total
    worksheet.addRow({});
    const filaTotal = worksheet.addRow({
      nombre: 'TOTAL INVENTARIO',
      valorTotal: `$${totalInventario.toFixed(2)}`
    });
    filaTotal.font = { bold: true };
    filaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };

    worksheet.columns.forEach(column => {
      column.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    logger.info('Reporte de productos generado');
    return workbook;
  } catch (error) {
    logger.error('Error al generar reporte de productos:', error);
    throw error;
  }
};

export const generarReporteOrdenes = async (estado?: string) => {
  try {
    const where = estado ? { estado } : {};

    const ordenes = await prisma.orden.findMany({
      where,
      include: {
        usuario: true,
        items: true
      },
      orderBy: { creado: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Órdenes');

    worksheet.columns = [
      { header: 'ID Orden', key: 'id', width: 36 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Fecha', key: 'fecha', width: 18 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Cantidad Items', key: 'items', width: 15 }
    ];

    crearEstiloCabecera(worksheet, 1);

    let totalVentas = 0;

    ordenes.forEach(orden => {
      totalVentas += orden.total;

      worksheet.addRow({
        id: orden.id,
        cliente: orden.usuario.nombre,
        email: orden.usuario.email,
        fecha: orden.creado.toLocaleDateString('es-ES'),
        total: `$${orden.total.toFixed(2)}`,
        estado: orden.estado,
        items: orden.items.length
      });
    });

    // Fila de total
    worksheet.addRow({});
    const filaTotal = worksheet.addRow({
      cliente: 'TOTAL VENTAS',
      total: `$${totalVentas.toFixed(2)}`
    });
    filaTotal.font = { bold: true };
    filaTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };

    worksheet.columns.forEach(column => {
      column.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    logger.info('Reporte de órdenes generado');
    return workbook;
  } catch (error) {
    logger.error('Error al generar reporte de órdenes:', error);
    throw error;
  }
};

export const generarReporteSuscripciones = async (estado?: string) => {
  try {
    const where = estado ? { estado } : {};

    const suscripciones = await prisma.suscripcion.findMany({
      where,
      include: {
        usuario: true,
        plan: true
      },
      orderBy: { creado: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Suscripciones');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Plan', key: 'plan', width: 15 },
      { header: 'Fecha Inicio', key: 'inicio', width: 18 },
      { header: 'Fecha Vencimiento', key: 'vencimiento', width: 18 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    crearEstiloCabecera(worksheet, 1);

    suscripciones.forEach(suscripcion => {
      worksheet.addRow({
        id: suscripcion.id,
        cliente: suscripcion.usuario.nombre,
        email: suscripcion.usuario.email,
        plan: suscripcion.plan.nombre,
        inicio: suscripcion.fechaInicio.toLocaleDateString('es-ES'),
        vencimiento: suscripcion.fechaVencimiento.toLocaleDateString('es-ES'),
        estado: suscripcion.estado
      });
    });

    worksheet.columns.forEach(column => {
      column.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    logger.info('Reporte de suscripciones generado');
    return workbook;
  } catch (error) {
    logger.error('Error al generar reporte de suscripciones:', error);
    throw error;
  }
};

export const generarReporteAsistencia = async (claseId?: string) => {
  try {
    const where = claseId ? { sesion: { claseId } } : {};

    const asistencias = await prisma.asistencia.findMany({
      where,
      include: {
        cliente: true,
        sesion: {
          include: {
            clase: true
          }
        }
      },
      orderBy: { creado: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencia');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Clase', key: 'clase', width: 20 },
      { header: 'Fecha/Hora Sesión', key: 'sesion', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    crearEstiloCabecera(worksheet, 1);

    asistencias.forEach(asistencia => {
      worksheet.addRow({
        id: asistencia.id,
        cliente: asistencia.cliente.nombre,
        clase: asistencia.sesion.clase.nombre,
        sesion: asistencia.sesion.fechaHora.toLocaleString('es-ES'),
        estado: asistencia.estado
      });
    });

    worksheet.columns.forEach(column => {
      column.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    logger.info('Reporte de asistencia generado');
    return workbook;
  } catch (error) {
    logger.error('Error al generar reporte de asistencia:', error);
    throw error;
  }
};