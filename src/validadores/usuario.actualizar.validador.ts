import z from "zod";

export const actualizarPerfilSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.email("Email inválido")
});

export const cambiarPasswordSchema = z.object({
    passwordActual: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    passwordNuevo: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type ActualizarPerfilDTO = z.infer<typeof actualizarPerfilSchema>;
export type CambiarPasswordDTO = z.infer<typeof cambiarPasswordSchema>;