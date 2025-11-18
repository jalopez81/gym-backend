/*
  Warnings:

  - The `estado` column on the `ordenes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'PAGADA', 'ENVIADA', 'CANCELADA', 'COMPLETADA');

-- AlterTable
ALTER TABLE "ordenes" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE';
