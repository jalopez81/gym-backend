import { z } from 'zod';

export const crearOrdenSchema = z.object({});

export type CrearOrdenDTO = z.infer<typeof crearOrdenSchema>;