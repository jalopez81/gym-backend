import { Router } from 'express';
import {
  descargarReporteUsuarios,
  descargarReporteProductos,
  descargarReporteOrdenes,
  descargarReporteSuscripciones,
  descargarReporteAsistencia
} from '../controladores/reporte.controlador';
import { autenticar, autorizar } from '../middlewares/auth.middleware';

const router = Router();

// Rutas solo para admin
router.get('/usuarios', autenticar, autorizar('admin'), descargarReporteUsuarios);
router.get('/productos', autenticar, autorizar('admin'), descargarReporteProductos);
router.get('/ordenes', autenticar, autorizar('admin'), descargarReporteOrdenes);
router.get('/suscripciones', autenticar, autorizar('admin'), descargarReporteSuscripciones);
router.get('/asistencia', autenticar, autorizar('admin'), descargarReporteAsistencia);

export default router;