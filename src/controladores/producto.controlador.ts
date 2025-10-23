import { Request, Response } from "express";
import z from "zod";
import { actualizarProductoSchema, crearProductoSchema } from "../validadores/producto.validador";
import { actualizarProducto, crearProducto, eliminarProducto, getProductoPorId, getProductos } from "../servicios/producto.servicio";
import logger from "../config/logger";

export const crear = async (req: Request, res: Response) => {
    try {
        const datosValidados = crearProductoSchema.parse(req.body);
        const producto = await crearProducto(datosValidados)

        return res.status(201).json({
            mensaje: "Producto creado exitosamente",
            producto
        })

    } catch (error: any) {
        logger.info(`Error al crear el producto: ${error}`)

        if (error.name === 'ZodError') {
            return res.status(400).json({
                mensaje: 'Datos inválidos',
                errores: error.issues
            })
        }

        return res.status(400).json({
            mensaje: error.message || "Error al crear el producto"
        })

    }
}

export const listar = async (req: Request, res: Response) => {
  try {
    const {
      pagina = '1',
      limite = '10',
      busqueda,
      categoria,
      ordenarPor = 'creado',
      orden = 'desc'
    } = req.query;

    const resultado = await getProductos({
      pagina: parseInt(pagina as string),
      limite: parseInt(limite as string),
      busqueda: busqueda as string,
      categoria: categoria as string,
      ordenarPor: ordenarPor as 'precio' | 'creado' | 'nombre',
      orden: orden as 'asc' | 'desc'
    });

    res.status(200).json(resultado);
  } catch (error: any) {
    logger.error('Error al listar productos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener productos'
    });
  }
};

export const getPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const producto = await getProductoPorId(id);

        return res.status(200).json(producto)
    } catch (error: any) {
        logger.info("Error al obtener el producto");

        return res.status(400).json({
            mensaje: error.message || "Producto no encontrado."
        })

    }
}

export const actualizar = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const datosValidados = actualizarProductoSchema.parse(req.body)
        const productoActualizado = await actualizarProducto(id, datosValidados)

        return res.status(200).json(productoActualizado)
    } catch (error: any) {
        logger.info(`Hubo un error al actualizar el producto: ${error}`);

        if (error.name === "ZodError") {
            return res.status(401).json({
                mensaje: "Datos inválidos",
                errores: error.issues
            })
        }

        return res.status(400).json({
            mensaje: error.message || "Hubo un error al actualizar el producto",
        })
    }
}

export const eliminar = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await eliminarProducto(id);

        res.status(200).json({
            mensaje: "Producto eliminado exitosamente",
            id
        })
    } catch (error: any) {
        logger.error(`No se pudo eliminar el producto: ${error}`)

        return res.status(404).json({
            mensaje: error.message || "No se pudo eliminar el producto"
        })
    }

}
