import { z } from 'zod';

export const crearSuscripcionSchema = z.object({
  planId: z.uuid('ID de plan inválido')
});

export type CrearSuscripcionDTO = z.infer<typeof crearSuscripcionSchema>;