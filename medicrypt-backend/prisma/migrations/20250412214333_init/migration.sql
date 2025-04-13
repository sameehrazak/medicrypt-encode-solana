-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT', 'RESEARCHER', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fileName" TEXT,
    "cid" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" "AccessStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShdwFile" (
    "id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "fileName" TEXT,
    "uploaderId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShdwFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShdwFile" ADD CONSTRAINT "ShdwFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
