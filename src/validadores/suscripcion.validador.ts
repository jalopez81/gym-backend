import { z } from 'zod';

export const crearSuscripcionSchema = z.object({
  planId: z.string('ID de plan inválido')
});

export type CrearSuscripcionDTO = z.infer<typeof crearSuscripcionSchema>;