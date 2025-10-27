import {z} from "zod";

export const crearProductoSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    descripcion: z.string().optional(),
    precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo').default(0),
    categoria: z.string().min(3, 'La categoria es requerida'),
    imagenUrl: z.string().optional(),
    imagenPublicId: z.string().optional(),
    imagenSecureUrl: z.string().optional(),
})

export const actualizarProductoSchema = z.object({
    nombre: z.string().min(3).optional(),
    descripcion: z.string().optional(),
    precio: z.coerce.number().positive().optional(),
    stock: z.coerce.number().min(0).int().optional(),
    categoria: z.string().min(3).optional(),
    imagenUrl: z.string().optional(),
    imagenPublicId: z.string().optional(),
    imagenSecureUrl: z.string().optional(),
})

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>