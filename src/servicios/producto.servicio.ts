import logger from "../config/logger";
import prisma from "../modelos/prisma";
import { ActualizarProductoDTO, CrearProductoDTO } from "../validadores/producto.validador";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const crearProducto = async (datos: CrearProductoDTO, imagen: Express.Multer.File) => {

    // Subir a Cloudinary    
    const uploadedImage = await cloudinary.uploader.upload(imagen.path, {
        folder: "productos",
    });

    datos = {
      ...datos,
      imagenSecureUrl: uploadedImage.secure_url,
      imagenUrl: uploadedImage.url,
      imagenPublicId: uploadedImage.public_id,
    }

    // prisma
    const producto = await prisma.producto.create({
        data: datos
    });

    logger.info('Producto creado con éxito:', producto);
    return {
        ...producto 
    };
}


interface FiltrosProducto {
    pagina?: number;
    limite?: number;
    busqueda?: string;
    categoria?: string;
    ordenarPor?: 'precio' | 'creado' | 'nombre';
    orden?: 'asc' | 'desc';
}

export const getProductos = async (filtros: FiltrosProducto = {}) => {
    const {
        pagina = 1,
        limite = 10,
        busqueda,
        categoria,
        ordenarPor = 'creado',
        orden = 'desc'
    } = filtros;

    const skip = (pagina - 1) * limite;

    const where: any = {};

    if (busqueda) {
        where.nombre = {
            contains: busqueda,
            mode: 'insensitive'
        };
    }

    if (categoria) {
        where.categoria = categoria;
    }

    const [productos, total] = await Promise.all([
        prisma.producto.findMany({
            where,
            skip,
            take: limite,
            orderBy: {
                [ordenarPor]: orden
            }
        }),
        prisma.producto.count({ where })
    ]);

    return {
        productos,
        paginacion: {
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};

export const getProductoPorId = async (id: string) => {
    const producto = await prisma.producto.findUnique({
        where: { id }
    });

    if (!producto) {
        return new Error('Producto no encontrado.')
    }

    return producto;
}

export const actualizarProducto = async (
  id: string,
  datos: ActualizarProductoDTO,
  imagen?: Express.Multer.File
) => {
  // Obtener producto existente
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) throw new Error("Producto no encontrado");

  // Manejo de imagen
  if (imagen) {
    if (producto.imagenPublicId) {
      await cloudinary.uploader.destroy(producto.imagenPublicId);
    }

    const uploadedImage = await cloudinary.uploader.upload(imagen.path, {
      folder: "productos",
    });

    datos = {
      ...datos,
      imagenSecureUrl: uploadedImage.secure_url,
      imagenUrl: uploadedImage.url,
      imagenPublicId: uploadedImage.public_id,
    };
  }

  // Actualizar producto
  const productoActualizado = await prisma.producto.update({
    where: { id },
    data: datos,
  });

  logger.info("Producto actualizado:", productoActualizado);
  return productoActualizado;
};


export const eliminarProducto = async (id: string) => {
    // revisar si producto existe (si no, getProductPorId devuelve error)
    const producto = await prisma.producto.findUnique({ where: { id } });


    if (!producto) throw new Error("Producto no encontrado");

    logger.info(`Producto eliminado: ${id}`);

    return await prisma.producto.delete({
        where: { id }
    });

}

