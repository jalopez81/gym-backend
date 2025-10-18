-- CreateTable
CREATE TABLE "planes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "duracionDias" INTEGER NOT NULL DEFAULT 30,
    "beneficios" TEXT,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planes_nombre_key" ON "planes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_usuarioId_estado_key" ON "suscripciones"("usuarioId", "estado");

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
