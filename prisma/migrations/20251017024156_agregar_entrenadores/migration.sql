-- CreateTable
CREATE TABLE "entrenadores" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "experiencia" INTEGER NOT NULL DEFAULT 0,
    "certificaciones" TEXT,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entrenadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entrenadores_usuarioId_key" ON "entrenadores"("usuarioId");

-- AddForeignKey
ALTER TABLE "entrenadores" ADD CONSTRAINT "entrenadores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
