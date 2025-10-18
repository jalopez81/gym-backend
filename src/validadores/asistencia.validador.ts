import { z } from 'zod';

export const crearAsistenciaSchema = z.object({
  sesionId: z.string().uuid('ID de sesión inválido'),
  clienteId: z.string().uuid('ID de cliente inválido'),
  estado: z.enum(['asistio', 'no_asistio', 'llego_tarde']).default('asistio'),
  horaEntrada: z.string().datetime().optional()
});

export type CrearAsistenciaDTO = z.infer<typeof crearAsistenciaSchema>;