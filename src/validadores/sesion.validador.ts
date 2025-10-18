import { z } from 'zod';

export const crearSesionSchema = z.object({
  claseId: z.string().uuid('ID de clase inválido'),
  fechaHora: z.string().datetime('Fecha y hora inválida')
});

export const actualizarSesionSchema = z.object({
  fechaHora: z.string().datetime().optional()
});

export type CrearSesionDTO = z.infer<typeof crearSesionSchema>;
export type ActualizarSesionDTO = z.infer<typeof actualizarSesionSchema>;