/*
  Warnings:

  - You are about to drop the `LabOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LabTestType` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('pending', 'in_progress', 'completed', 'validated', 'cancelled');

-- CreateEnum
CREATE TYPE "ExamPriority" AS ENUM ('low', 'normal', 'urgent');

-- DropForeignKey
ALTER TABLE "LabOrder" DROP CONSTRAINT "LabOrder_appointmentId_fkey";

-- DropTable
DROP TABLE "LabOrder";

-- DropTable
DROP TABLE "LabTestType";

-- CreateTable
CREATE TABLE "exam_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "department" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_requests" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "examTypeId" TEXT NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'pending',
    "priority" "ExamPriority" NOT NULL DEFAULT 'normal',
    "requestedBy" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" JSONB,
    "notes" TEXT,
    "validatedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exam_types_code_key" ON "exam_types"("code");

-- CreateIndex
CREATE INDEX "exam_requests_appointmentId_idx" ON "exam_requests"("appointmentId");

-- CreateIndex
CREATE INDEX "exam_requests_examTypeId_idx" ON "exam_requests"("examTypeId");

-- CreateIndex
CREATE INDEX "exam_requests_status_idx" ON "exam_requests"("status");

-- AddForeignKey
ALTER TABLE "exam_requests" ADD CONSTRAINT "exam_requests_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_requests" ADD CONSTRAINT "exam_requests_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "exam_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
