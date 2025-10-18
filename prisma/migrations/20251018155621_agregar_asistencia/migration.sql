-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'asistio',
    "horaEntrada" TIMESTAMP(3),
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_sesionId_clienteId_key" ON "asistencias"("sesionId", "clienteId");

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
