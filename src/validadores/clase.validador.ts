import { z } from 'zod';

export const crearClaseSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  duracion: z.number().int().default(60),
  capacidad: z.number().int().min(1, 'La capacidad debe ser mínimo 1'),
  entrenadorId: z.string('ID de entrenador inválido')
});

export const actualizarClaseSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  duracion: z.number().int().default(60),
  capacidad: z.number().int().min(1, 'La capacidad debe ser mínimo 1'),
    entrenadorId: z.string().optional()
});

export type CrearClaseDTO = z.infer<typeof crearClaseSchema>;
export type ActualizarClaseDTO = z.infer<typeof actualizarClaseSchema>;