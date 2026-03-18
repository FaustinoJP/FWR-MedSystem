/*
  Warnings:

  - The `status` column on the `Encounter` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "status",
ADD COLUMN     "status" "EncounterStatus" NOT NULL DEFAULT 'OPEN';
