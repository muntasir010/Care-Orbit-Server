/*
  Warnings:

  - You are about to drop the column `prescriptionUploadId` on the `medicine_orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicine_orders" DROP CONSTRAINT "medicine_orders_prescriptionId_fkey";

-- DropIndex
DROP INDEX "medicine_orders_prescriptionUploadId_key";

-- AlterTable
ALTER TABLE "medicine_orders" DROP COLUMN "prescriptionUploadId";
