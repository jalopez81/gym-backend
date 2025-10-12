import {z} from "zod";

export const crearProductoSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
    categoria: z.string().min(3, 'La categoria es requerida'),
})

export const actualizarProductoSchema = z.object({
    nombre: z.string().min(3).optional(),
    descripcion: z.string().optional(),
    precio: z.number().positive().optional(),
    stock: z.number().min(0).int().optional(),
    categoria: z.string().min(3).optional(),
})

export type CrearProductDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductDTO = z.infer<typeof actualizarProductoSchema>