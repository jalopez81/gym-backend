import { z } from 'zod';

export const crearReservaSchema = z.object({
  sesionId: z.string('ID de sesión inválido')
});

export type CrearReservaDTO = z.infer<typeof crearReservaSchema>;