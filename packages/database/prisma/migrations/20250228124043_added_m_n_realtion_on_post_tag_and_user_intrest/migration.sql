/*
  Warnings:

  - You are about to drop the column `tag` on the `Post_Tags` table. All the data in the column will be lost.
  - You are about to drop the column `interest` on the `User_Interests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,tagId]` on the table `Post_Tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,interestId]` on the table `User_Interests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagId` to the `Post_Tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestId` to the `User_Interests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post_Tags" DROP COLUMN "tag",
ADD COLUMN     "tagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User_Interests" DROP COLUMN "interest",
ADD COLUMN     "interestId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Post_Tags_postId_tagId_key" ON "Post_Tags"("postId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "User_Interests_userId_interestId_key" ON "User_Interests"("userId", "interestId");

-- AddForeignKey
ALTER TABLE "User_Interests" ADD CONSTRAINT "User_Interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Tags" ADD CONSTRAINT "Post_Tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
