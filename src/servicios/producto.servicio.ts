import logger from "../config/logger";
import prisma from "../modelos/prisma";
import { ActualizarProductoDTO, CrearProductoDTO } from "../validadores/producto.validador";

export const crearProducto = async (datos: CrearProductoDTO) => {
    const producto = await prisma.producto.create({
        data: datos
    });

    logger.info('Producto creado con éxito:', producto);
    return producto;
}

export const getProductos = async () => {
    const productos = prisma.producto.findMany({
        orderBy: { creado: 'desc' }
    });
}

export const getProductoPorId = async (id: string) => {
    const producto = prisma.producto.findUnique({
        where: { id }
    });

    if (!producto) {
        return new Error('Producto no encontrado.')
    }

    return producto;
}

export const actualizarProducto = async (id: string, datos: ActualizarProductoDTO) => {
    // revisar si producto existe (si no, getProductPorId devuelve error)
    await getProductoPorId(id);

    const producto = await prisma.producto.update({
        where: {id},
        data: datos
    });

    logger.info('Producto actualizado: ', producto);
    return producto;
}

export const eliminarProducto = async (id: string) => {
    // revisar si producto existe (si no, getProductPorId devuelve error)
    await getProductoPorId(id);

    const producto = prisma.producto.delete({
        where: {id}
    });

    logger.info("Producto eliminado: ", producto);
    return producto;
}