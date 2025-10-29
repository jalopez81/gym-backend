import prisma from '../modelos/prisma';
import logger from '../config/logger';
import { ActualizarCarritoDTO, AgregarAlCarritoDTO } from '../validadores/carrito.validador';

export const agregarAlCarrito = async (usuarioId: string, datos: AgregarAlCarritoDTO) => {
  // Verificar que el producto existe
  const producto = await prisma.producto.findUnique({
    where: { id: datos.producto.id }
  });

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  // Verificar stock
  if (producto.stock < datos.cantidad) {
    throw new Error(`Stock insuficiente. Disponibles: ${producto.stock}`);
  }

  // Verificar si el producto ya está en el carrito
  const itemExistente = await prisma.carritoItem.findFirst({
    where: {
      usuarioId,
      productoId: datos.producto.id
    }
  });

  let carritoItem;

  if (itemExistente) {
    // Actualizar cantidad si ya existe
    carritoItem = await prisma.carritoItem.update({
      where: { id: itemExistente.id },
      data: {
        cantidad: datos.cantidad
      },
      include: {
        producto: true
      }
    });
  } else {
    // Crear nuevo item
    carritoItem = await prisma.carritoItem.create({
      data: {
        usuarioId,
        productoId: datos.producto.id,
        cantidad: datos.cantidad
      },
      include: {
        producto: true
      }
    });
  }

  logger.info(`Producto agregado al carrito: ${usuarioId}`);
  return carritoItem;
};

export const obtenerCarrito = async (usuarioId: string) => {
  const items = await prisma.carritoItem.findMany({
    where: { usuarioId },
    include: {
      producto: true
    }
  });

  const total = items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

  return {
    usuarioId,
    items,
    total,
    cantidadItems: items.length
  };
};


export const eliminarDelCarrito = async (usuarioId: string, productoId: string) => {
  const carritoItem = await prisma.carritoItem.findFirst({
    where: {
      usuarioId,
      productoId
    }
  });

  if (!carritoItem) {
    throw new Error('Producto no encontrado en el carrito');
  }

  await prisma.carritoItem.delete({
    where: { id: carritoItem.id }
  });

  logger.info(`Producto eliminado del carrito: ${usuarioId}`);
};

export const vaciarCarrito = async (usuarioId: string) => {
  await prisma.carritoItem.deleteMany({
    where: { usuarioId }
  });

  logger.info(`Carrito vaciado: ${usuarioId}`);
};