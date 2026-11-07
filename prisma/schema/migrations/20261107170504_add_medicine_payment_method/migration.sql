-- CreateEnum
CREATE TYPE "MedicinePaymentMethod" AS ENUM ('ONLINE', 'COD');

-- AlterTable
ALTER TABLE "medicine_orders" ADD COLUMN     "paymentMethod" "MedicinePaymentMethod" NOT NULL DEFAULT 'ONLINE';
