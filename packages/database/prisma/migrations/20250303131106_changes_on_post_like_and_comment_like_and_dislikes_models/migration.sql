/*
  Warnings:

  - You are about to drop the `Comment_Dislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment_Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post_Dislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post_Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "Comment_Dislike" DROP CONSTRAINT "Comment_Dislike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment_Dislike" DROP CONSTRAINT "Comment_Dislike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment_Like" DROP CONSTRAINT "Comment_Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment_Like" DROP CONSTRAINT "Comment_Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Dislike" DROP CONSTRAINT "Post_Dislike_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Dislike" DROP CONSTRAINT "Post_Dislike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Like" DROP CONSTRAINT "Post_Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Like" DROP CONSTRAINT "Post_Like_userId_fkey";

-- DropTable
DROP TABLE "Comment_Dislike";

-- DropTable
DROP TABLE "Comment_Like";

-- DropTable
DROP TABLE "Post_Dislike";

-- DropTable
DROP TABLE "Post_Like";

-- CreateTable
CREATE TABLE "Post_Reaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment_Reaction" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_Reaction_postId_userId_key" ON "Post_Reaction"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_Reaction_commentId_userId_key" ON "Comment_Reaction"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "Post_Reaction" ADD CONSTRAINT "Post_Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Reaction" ADD CONSTRAINT "Post_Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Reaction" ADD CONSTRAINT "Comment_Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Reaction" ADD CONSTRAINT "Comment_Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
