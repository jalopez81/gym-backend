import { z } from 'zod';

export const agregarAlCarritoSchema = z.object({
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1'),
  producto: z.object({
    id: z.string()
  })
});

export const actualizarCarritoSchema = z.object({
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1'),
  id: z.string()  
});

export type AgregarAlCarritoDTO = z.infer<typeof agregarAlCarritoSchema>;
export type ActualizarCarritoDTO = z.infer<typeof actualizarCarritoSchema>;