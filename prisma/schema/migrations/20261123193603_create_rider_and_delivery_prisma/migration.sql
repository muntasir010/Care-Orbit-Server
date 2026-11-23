-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'FAILED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'RIDER';

-- CreateTable
CREATE TABLE "medicine_delivery_assignments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_delivery_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_delivery_locations" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_delivery_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider_reviews" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rider_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medicine_delivery_assignments_orderId_key" ON "medicine_delivery_assignments"("orderId");

-- CreateIndex
CREATE INDEX "medicine_delivery_assignments_riderId_idx" ON "medicine_delivery_assignments"("riderId");

-- CreateIndex
CREATE INDEX "medicine_delivery_assignments_status_idx" ON "medicine_delivery_assignments"("status");

-- CreateIndex
CREATE INDEX "medicine_delivery_locations_assignmentId_idx" ON "medicine_delivery_locations"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "rider_reviews_orderId_key" ON "rider_reviews"("orderId");

-- CreateIndex
CREATE INDEX "rider_reviews_riderId_idx" ON "rider_reviews"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "riders_email_key" ON "riders"("email");

-- AddForeignKey
ALTER TABLE "medicine_delivery_assignments" ADD CONSTRAINT "medicine_delivery_assignments_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "riders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_delivery_assignments" ADD CONSTRAINT "medicine_delivery_assignments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "medicine_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_delivery_assignments" ADD CONSTRAINT "medicine_delivery_assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_delivery_locations" ADD CONSTRAINT "medicine_delivery_locations_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "medicine_delivery_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_reviews" ADD CONSTRAINT "rider_reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_reviews" ADD CONSTRAINT "rider_reviews_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "riders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_reviews" ADD CONSTRAINT "rider_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "medicine_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riders" ADD CONSTRAINT "riders_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
