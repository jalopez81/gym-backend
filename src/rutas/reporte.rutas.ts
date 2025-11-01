import { Router } from 'express';
import {
  descargarReporteUsuarios,
  descargarReporteProductos,
  descargarReporteOrdenes,
  descargarReporteSuscripciones,
  descargarReporteAsistencia
} from '../controladores/reporte.controlador';
import { autenticar, autorizar, ROLES } from '../middlewares/auth.middleware';

const router = Router();

// Rutas solo para admin
router.get('/usuarios', autenticar, autorizar(ROLES.ADMIN), descargarReporteUsuarios);
router.get('/productos', autenticar, autorizar(ROLES.ADMIN), descargarReporteProductos);
router.get('/ordenes', autenticar, autorizar(ROLES.ADMIN), descargarReporteOrdenes);
router.get('/suscripciones', autenticar, autorizar(ROLES.ADMIN), descargarReporteSuscripciones);
router.get('/asistencia', autenticar, autorizar(ROLES.ADMIN), descargarReporteAsistencia);

export default router;