/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `thumnailUrl` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `channelName` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "avatarUrl",
DROP COLUMN "name",
DROP COLUMN "thumnailUrl",
ADD COLUMN     "channelAvatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "channelBanner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "channelDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "channelName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "YoutubeVideos" (
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoDescription" TEXT NOT NULL,
    "videoThumbnail" TEXT NOT NULL,
    "videoPublishedAt" TIMESTAMP(3) NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "YoutubeVideos_pkey" PRIMARY KEY ("videoId")
);

-- AddForeignKey
ALTER TABLE "YoutubeVideos" ADD CONSTRAINT "YoutubeVideos_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
