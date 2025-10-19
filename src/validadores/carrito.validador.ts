import { z } from 'zod';

export const agregarAlCarritoSchema = z.object({
  productoId: z.uuid('ID de producto inválido'),
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1')
});

export const actualizarCarritoSchema = z.object({
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1')
});

export type AgregarAlCarritoDTO = z.infer<typeof agregarAlCarritoSchema>;
export type ActualizarCarritoDTO = z.infer<typeof actualizarCarritoSchema>;