import { z } from 'zod';

export const actualizarConfiguracionSchema = z.object({
  nombreGimnasio: z.string().min(2),
  direccion: z.string().min(3),
  telefono: z.string().min(5),
  emailContacto: z.string().email(),
  moneda: z.string().min(3),
  impuestos: z.number().min(0).max(100),
  horarioApertura: z.string(),
  horarioCierre: z.string(),
  permitirReservas: z.boolean(),
  duracionSesionMinutos: z.number().min(15),
  maxClasesPorDia: z.number().min(1),
  permitirPagoOnline: z.boolean(),
  metodosPago: z.array(z.string()),
  notificarEmail: z.boolean(),
  emailNotificaciones: z.string().email().optional(),
  notificarWhatsapp: z.boolean(),
  whatsappNumero: z.string().optional(),
  logoUrl: z.string().optional(),
  colorPrincipal: z.string(),
  colorSecundario: z.string()
});

export type ActualizarConfiguracionDTO = z.infer<typeof actualizarConfiguracionSchema>;
