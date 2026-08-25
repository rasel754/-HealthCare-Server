/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `followUpDate` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `medical_reports` table. All the data in the column will be lost.
  - The `maritalStatus` column on the `patient_health_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `reportLink` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportName` to the `medical_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_doctorId_fkey";

-- DropIndex
DROP INDEX "medical_reports_appointmentId_key";

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "appointmentId",
DROP COLUMN "diagnosis",
DROP COLUMN "doctorId",
DROP COLUMN "followUpDate",
DROP COLUMN "treatment",
ADD COLUMN     "reportLink" TEXT NOT NULL,
ADD COLUMN     "reportName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patient_health_data" DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" TEXT;

-- CreateIndex
CREATE INDEX "medical_reports_patientId_idx" ON "medical_reports"("patientId");
