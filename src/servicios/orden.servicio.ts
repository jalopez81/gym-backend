import prisma from '../modelos/prisma';
import logger from '../config/logger';
import { enviarEmail } from '../config/mailer';
import { templateConfirmacionOrden, templateNotificacionAdmin } from '../utils/emailTemplates';

export const crearOrden = async (usuarioId: string) => {
  // Obtener carrito del usuario
  const carritoItems = await prisma.carritoItem.findMany({
    where: { usuarioId },
    include: { producto: true }
  });

  if (carritoItems.length === 0) {
    throw new Error('El carrito está vacío');
  }

  // Calcular total
  const total = carritoItems.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  // Crear orden
  const orden = await prisma.orden.create({
    data: {
      usuarioId,
      total,
      items: {
        create: carritoItems.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad
        }))
      }
    },
    include: {
      items: {
        include: {
          producto: true
        }
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    }
  });

  logger.info(`Orden creada: ${orden.id}`);
  return orden;
};

export const obtenerMisOrdenes = async (usuarioId: string) => {
  return await prisma.orden.findMany({
    where: { usuarioId },
    include: {
      items: {
        include: {
          producto: true
        }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const obtenerOrdenPorId = async (ordenId: string, usuarioId: string) => {
  const orden = await prisma.orden.findUnique({
    where: { id: ordenId },
    include: {
      items: {
        include: {
          producto: true
        }
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    }
  });

  if (!orden) {
    throw new Error('Orden no encontrada');
  }

  // Verificar que pertenece al usuario o el usuario es admin
  if (orden.usuarioId !== usuarioId) {
    throw new Error('No tienes permiso para ver esta orden');
  }

  return orden;
};

export const obtenerTodasLasOrdenes = async () => {
  return await prisma.orden.findMany({
    include: {
      items: {
        include: {
          producto: true
        }
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    },
    orderBy: { creado: 'desc' }
  });
};

export const completarOrden = async (ordenId: string, usuarioId: string) => {
  const orden = await prisma.orden.findUnique({
    where: { id: ordenId },
    include: {
      items: true,
      usuario: true
    }
  });

  if (!orden) {
    throw new Error('Orden no encontrada');
  }

  // Verificar que pertenece al usuario
  if (orden.usuarioId !== usuarioId) {
    throw new Error('No tienes permiso para completar esta orden');
  }

  if (orden.estado !== 'PENDIENTE') {
    throw new Error('Esta orden ya ha sido completada o cancelada');
  }

  // Descontar stock de cada producto
  for (const item of orden.items) {
    await prisma.producto.update({
      where: { id: item.productoId },
      data: {
        stock: {
          decrement: item.cantidad
        }
      }
    });
  }

  // Actualizar estado de la orden
  const ordenActualizada = await prisma.orden.update({
    where: { id: ordenId },
    data: { estado: 'COMPLETADA' },
    include: {
      items: {
        include: {
          producto: true
        }
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      }
    }
  });

  // Vaciar carrito
  await prisma.carritoItem.deleteMany({
    where: { usuarioId }
  });

  // Enviar email al cliente
  enviarEmail(
    ordenActualizada.usuario.email,
    `Orden #${ordenId} Confirmada`,
    templateConfirmacionOrden(
      ordenActualizada.usuario.nombre,
      ordenId,
      ordenActualizada.total,
      ordenActualizada.items.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.precioUnitario
      }))
    )
  );

  // Enviar notificación al admin
  enviarEmail(
    process.env.EMAIL_USER || '',
    'Nueva Orden Completada',
    templateNotificacionAdmin(
      ordenActualizada.usuario.nombre,
      ordenActualizada.usuario.email,
      ordenActualizada.total,
      ordenId
    )
  );

  logger.info(`Orden completada: ${ordenId}`);
  return ordenActualizada;
};

export const cancelarOrden = async (ordenId: string, usuarioId: string) => {
  const orden = await prisma.orden.findUnique({
    where: { id: ordenId }
  });

  if (!orden) {
    throw new Error('Orden no encontrada');
  }

  if (orden.usuarioId !== usuarioId) {
    throw new Error('No tienes permiso para cancelar esta orden');
  }

  if (orden.estado === 'COMPLETADA') {
    throw new Error('No se puede cancelar una orden completada');
  }

  const ordenActualizada = await prisma.orden.update({
    where: { id: ordenId },
    data: { estado: 'CANCELADA' }
  });

  logger.info(`Orden cancelada: ${ordenId}`);
  return ordenActualizada;
};