/*
  Warnings:

  - A unique constraint covering the columns `[medicineOrderId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointmentId_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "medicineOrderId" TEXT,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_medicineOrderId_key" ON "payments"("medicineOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_medicineOrderId_fkey" FOREIGN KEY ("medicineOrderId") REFERENCES "medicine_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
