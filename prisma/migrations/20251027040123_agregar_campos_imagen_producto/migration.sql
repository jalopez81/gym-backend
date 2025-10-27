/*
  Warnings:

  - You are about to drop the column `imagenUrl` on the `productos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "imagenUrl",
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageSecureUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT;
