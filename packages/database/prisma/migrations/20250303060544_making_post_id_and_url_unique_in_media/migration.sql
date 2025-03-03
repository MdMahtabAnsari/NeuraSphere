/*
  Warnings:

  - A unique constraint covering the columns `[postId,url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Media_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Media_postId_url_key" ON "Media"("postId", "url");
