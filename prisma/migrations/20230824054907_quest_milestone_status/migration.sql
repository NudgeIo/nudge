/*
  Warnings:

  - You are about to drop the column `credits` on the `CreatorFan` table. All the data in the column will be lost.
  - You are about to drop the `YoutubeVideos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('LIKE', 'COMMENT', 'NUDGE', 'SUBSCRIBE');

-- CreateEnum
CREATE TYPE "QuestProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "YoutubeVideos" DROP CONSTRAINT "YoutubeVideos_channelId_fkey";

-- AlterTable
ALTER TABLE "CreatorFan" DROP COLUMN "credits",
ADD COLUMN     "creatorCash" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referrerId" TEXT;

-- DropTable
DROP TABLE "YoutubeVideos";

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "videoThumbnail" TEXT,
    "videoPublishedAt" TIMESTAMP(3),
    "videoId" TEXT,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MilestoneType" NOT NULL,
    "reward" INTEGER NOT NULL,
    "questId" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestStatus" (
    "id" TEXT NOT NULL,
    "creatorFanId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "QuestProgressStatus" NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "QuestStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreatorFan" ADD CONSTRAINT "CreatorFan_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "CreatorFan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestStatus" ADD CONSTRAINT "QuestStatus_creatorFanId_fkey" FOREIGN KEY ("creatorFanId") REFERENCES "CreatorFan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestStatus" ADD CONSTRAINT "QuestStatus_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
