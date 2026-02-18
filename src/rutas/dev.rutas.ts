import { Router } from 'express';
import prisma from '../modelos/prisma';

const router = Router();

router.post('/reset-db', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ mensaje: 'No permitido en producción' });
  }

  await prisma.$transaction([
    prisma.asignacionEntrenador.deleteMany(),
    prisma.asistencia.deleteMany(),
    prisma.carritoItem.deleteMany(),
    prisma.clase.deleteMany(),
    prisma.entrenador.deleteMany(),
    prisma.orden.deleteMany(),
    prisma.ordenItem.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.reserva.deleteMany(),
    prisma.sesion.deleteMany(),
    prisma.suscripcion.deleteMany(),
    prisma.usuario.deleteMany(),
    prisma.configuracion.deleteMany(),
   
  ]);

  res.json({ mensaje: 'Base de datos reiniciada' });
});

export default router;
