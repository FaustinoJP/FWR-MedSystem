-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
