-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE');

-- CreateTable
CREATE TABLE "NudgeUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "provider" "Provider" NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "NudgeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorFan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "nudgeUserId" TEXT NOT NULL,

    CONSTRAINT "CreatorFan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NudgeUser_email_key" ON "NudgeUser"("email");

-- AddForeignKey
ALTER TABLE "CreatorFan" ADD CONSTRAINT "CreatorFan_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorFan" ADD CONSTRAINT "CreatorFan_nudgeUserId_fkey" FOREIGN KEY ("nudgeUserId") REFERENCES "NudgeUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
