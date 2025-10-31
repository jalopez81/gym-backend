import { z } from 'zod';

export const crearEntrenadorSchema = z.object({
  usuarioId: z.string('ID de usuario inválido'),
  especialidad: z.string().min(3, 'La especialidad es requerida'),
  experiencia: z.number().int().min(0, 'Los años de experiencia no pueden ser negativos').default(0),
  certificaciones: z.string().optional()
});

export const actualizarEntrenadorSchema = z.object({
  especialidad: z.string().min(3).optional(),
  experiencia: z.number().int().min(0).optional(),
  certificaciones: z.string().optional()
});

export type CrearEntrenadorDTO = z.infer<typeof crearEntrenadorSchema>;
export type ActualizarEntrenadorDTO = z.infer<typeof actualizarEntrenadorSchema>;