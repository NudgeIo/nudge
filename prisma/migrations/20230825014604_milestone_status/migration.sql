/*
  Warnings:

  - Changed the type of `status` on the `QuestStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuestStatus" DROP COLUMN "status",
ADD COLUMN     "status" "ProgressStatus" NOT NULL;

-- DropEnum
DROP TYPE "QuestProgressStatus";

-- CreateTable
CREATE TABLE "MilestoneStatus" (
    "id" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL,
    "creatorFanId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MilestoneStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MilestoneStatus" ADD CONSTRAINT "MilestoneStatus_creatorFanId_fkey" FOREIGN KEY ("creatorFanId") REFERENCES "CreatorFan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneStatus" ADD CONSTRAINT "MilestoneStatus_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
