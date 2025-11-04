import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const existente = await prisma.configuracion.findFirst();
    if (!existente) {
        await prisma.configuracion.create({
            data: {
                nombreGimnasio: 'GymPlus Fitness Center',
                direccion: 'Av. Bolívar 123, Santo Domingo',
                telefono: '+1 (809) 555-1234',
                emailContacto: 'contacto@gymplus.do',
                moneda: 'DOP',
                impuestos: 18,
                horarioApertura: '06:00',
                horarioCierre: '22:00',
                permitirReservas: true,
                duracionSesionMinutos: 60,
                maxClasesPorDia: 5,
                permitirPagoOnline: true,
                metodosPago: ['Tarjeta', 'Efectivo'],
                notificarEmail: true,
                emailNotificaciones: 'notificaciones@gymplus.do',
                notificarWhatsapp: false,
                logoUrl: '/images/logo.png',
                colorPrincipal: '#1976d2',
                colorSecundario: '#9c27b0',
            },
        });
        console.log('✅ Configuración inicial creada');
    } else {
        console.log('⚙️ Ya existe una configuración');
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
