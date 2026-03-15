-- CreateTable
CREATE TABLE "Triage" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Triage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "chiefComplaint" TEXT,
    "historyOfPresentIllness" TEXT,
    "physicalExam" TEXT,
    "assessment" TEXT,
    "plan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Triage_appointmentId_key" ON "Triage"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_appointmentId_key" ON "Encounter"("appointmentId");

-- AddForeignKey
ALTER TABLE "Triage" ADD CONSTRAINT "Triage_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
