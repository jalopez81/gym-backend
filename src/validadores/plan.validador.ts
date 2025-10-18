import { z } from 'zod';

export const crearPlanSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  duracionDias: z.number().int().min(1, 'La duración mínima es 1 día').default(30),
  beneficios: z.string().optional()
});

export const actualizarPlanSchema = z.object({
  nombre: z.string().min(3).optional(),
  descripcion: z.string().optional(),
  precio: z.number().positive().optional(),
  duracionDias: z.number().int().min(1).optional(),
  beneficios: z.string().optional()
});

export type CrearPlanDTO = z.infer<typeof crearPlanSchema>;
export type ActualizarPlanDTO = z.infer<typeof actualizarPlanSchema>;