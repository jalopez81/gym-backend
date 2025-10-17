-- CreateTable
CREATE TABLE "asignaciones_entrenador" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "entrenadorId" TEXT NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asignaciones_entrenador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_entrenador_clienteId_entrenadorId_key" ON "asignaciones_entrenador"("clienteId", "entrenadorId");

-- AddForeignKey
ALTER TABLE "asignaciones_entrenador" ADD CONSTRAINT "asignaciones_entrenador_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_entrenador" ADD CONSTRAINT "asignaciones_entrenador_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "entrenadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
