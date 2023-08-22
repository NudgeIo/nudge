/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "YoutubeVideos" DROP CONSTRAINT "YoutubeVideos_channelId_fkey";

-- DropTable
DROP TABLE "Channel";

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "customUrl" TEXT,
    "channelAvatar" TEXT NOT NULL DEFAULT '',
    "channelBanner" TEXT NOT NULL DEFAULT '',
    "channelDescription" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_channelId_key" ON "Creator"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_customUrl_key" ON "Creator"("customUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_slug_key" ON "Creator"("slug");

-- AddForeignKey
ALTER TABLE "YoutubeVideos" ADD CONSTRAINT "YoutubeVideos_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Creator"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
