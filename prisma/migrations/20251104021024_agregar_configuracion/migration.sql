-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "nombreGimnasio" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "emailContacto" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "impuestos" DOUBLE PRECISION NOT NULL,
    "horarioApertura" TEXT NOT NULL,
    "horarioCierre" TEXT NOT NULL,
    "permitirReservas" BOOLEAN NOT NULL,
    "duracionSesionMinutos" INTEGER NOT NULL,
    "maxClasesPorDia" INTEGER NOT NULL,
    "permitirPagoOnline" BOOLEAN NOT NULL,
    "metodosPago" TEXT[],
    "notificarEmail" BOOLEAN NOT NULL,
    "emailNotificaciones" TEXT,
    "notificarWhatsapp" BOOLEAN NOT NULL,
    "whatsappNumero" TEXT,
    "logoUrl" TEXT,
    "colorPrincipal" TEXT NOT NULL,
    "colorSecundario" TEXT NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);
