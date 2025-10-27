/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `imageSecureUrl` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `productos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "imagePublicId",
DROP COLUMN "imageSecureUrl",
DROP COLUMN "imageUrl",
ADD COLUMN     "imagenPublicId" TEXT,
ADD COLUMN     "imagenSecureUrl" TEXT,
ADD COLUMN     "imagenUrl" TEXT;
