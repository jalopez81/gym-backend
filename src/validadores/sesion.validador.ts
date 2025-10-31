import { z } from 'zod';

export const crearSesionSchema = z.object({
  claseId: z.string('ID de clase inválido'),
  fechaHora: z.iso.datetime('Fecha y hora inválida')
});

export const actualizarSesionSchema = z.object({
  fechaHora: z.iso.datetime().optional()
});

export type CrearSesionDTO = z.infer<typeof crearSesionSchema>;
export type ActualizarSesionDTO = z.infer<typeof actualizarSesionSchema>;