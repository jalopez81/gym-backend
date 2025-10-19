import { Request, Response } from 'express';
import {
  generarReporteUsuarios,
  generarReporteProductos,
  generarReporteOrdenes,
  generarReporteSuscripciones,
  generarReporteAsistencia
} from '../servicios/reporte.servicio';
import logger from '../config/logger';

export const descargarReporteUsuarios = async (req: Request, res: Response) => {
  try {
    const workbook = await generarReporteUsuarios();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-usuarios.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

    logger.info('Reporte de usuarios descargado');
  } catch (error: any) {
    logger.error('Error al descargar reporte de usuarios:', error);
    res.status(500).json({
      mensaje: 'Error al generar reporte'
    });
  }
};

export const descargarReporteProductos = async (req: Request, res: Response) => {
  try {
    const workbook = await generarReporteProductos();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-productos.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

    logger.info('Reporte de productos descargado');
  } catch (error: any) {
    logger.error('Error al descargar reporte de productos:', error);
    res.status(500).json({
      mensaje: 'Error al generar reporte'
    });
  }
};

export const descargarReporteOrdenes = async (req: Request, res: Response) => {
  try {
    const { estado } = req.query;

    const workbook = await generarReporteOrdenes(estado as string);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-ordenes.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

    logger.info('Reporte de órdenes descargado');
  } catch (error: any) {
    logger.error('Error al descargar reporte de órdenes:', error);
    res.status(500).json({
      mensaje: 'Error al generar reporte'
    });
  }
};

export const descargarReporteSuscripciones = async (req: Request, res: Response) => {
  try {
    const { estado } = req.query;

    const workbook = await generarReporteSuscripciones(estado as string);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-suscripciones.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

    logger.info('Reporte de suscripciones descargado');
  } catch (error: any) {
    logger.error('Error al descargar reporte de suscripciones:', error);
    res.status(500).json({
      mensaje: 'Error al generar reporte'
    });
  }
};

export const descargarReporteAsistencia = async (req: Request, res: Response) => {
  try {
    const { claseId } = req.query;

    const workbook = await generarReporteAsistencia(claseId as string);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-asistencia.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

    logger.info('Reporte de asistencia descargado');
  } catch (error: any) {
    logger.error('Error al descargar reporte de asistencia:', error);
    res.status(500).json({
      mensaje: 'Error al generar reporte'
    });
  }
};