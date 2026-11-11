/*
  Warnings:

  - You are about to drop the column `prescriptionId` on the `medicine_orders` table. All the data in the column will be lost.
  - Added the required column `shippingDistrict` to the `medicine_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine_orders" DROP COLUMN "prescriptionId",
ADD COLUMN     "shippingDistrict" TEXT NOT NULL;
