import { z } from 'zod';

export const crearClaseSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  duracion: z.number().int().min(15, 'La duración mínima es 15 minutos').default(60),
  capacidad: z.number().int().min(1, 'La capacidad debe ser mínimo 1'),
  entrenadorId: z.string().uuid('ID de entrenador inválido')
});

export const actualizarClaseSchema = z.object({
  nombre: z.string().min(3).optional(),
  descripcion: z.string().optional(),
  duracion: z.number().int().min(15).optional(),
  capacidad: z.number().int().min(1).optional(),
  entrenadorId: z.string().uuid().optional()
});

export type CrearClaseDTO = z.infer<typeof crearClaseSchema>;
export type ActualizarClaseDTO = z.infer<typeof actualizarClaseSchema>;