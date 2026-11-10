/*
  Warnings:

  - You are about to drop the column `requiresPrescription` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the `prescription_medicines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescription_uploads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicine_orders" DROP CONSTRAINT "medicine_orders_prescriptionUploadId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_medicines" DROP CONSTRAINT "prescription_medicines_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_medicines" DROP CONSTRAINT "prescription_medicines_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_uploads" DROP CONSTRAINT "prescription_uploads_patientId_fkey";

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "requiresPrescription";

-- DropTable
DROP TABLE "prescription_medicines";

-- DropTable
DROP TABLE "prescription_uploads";
