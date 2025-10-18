-- CreateTable
CREATE TABLE "clases" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "duracion" INTEGER NOT NULL DEFAULT 60,
    "capacidad" INTEGER NOT NULL,
    "entrenadorId" TEXT NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'reservado',
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservas_clienteId_sesionId_key" ON "reservas"("clienteId", "sesionId");

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "entrenadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
