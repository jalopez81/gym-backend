import { z } from 'zod';

export const registroSchema = z.object({
    email: z.email('Email inválido'),
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.enum(['admin', 'cliente', 'entrenador', 'recepcionista']).optional()
});

export const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

export type RegistroDTO = z.infer<typeof registroSchema>;;
export type LoginDTO = z.infer<typeof loginSchema>;