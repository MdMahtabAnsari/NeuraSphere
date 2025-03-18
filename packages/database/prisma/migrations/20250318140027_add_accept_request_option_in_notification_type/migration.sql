/*
  Warnings:

  - The values [Mention] on the enum `Notification_Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Notification_Type_new" AS ENUM ('Post', 'Reply', 'Comment', 'Like', 'Dislike', 'Follow', 'Unfollow', 'Request', 'Accept');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "Notification_Type_new" USING ("type"::text::"Notification_Type_new");
ALTER TYPE "Notification_Type" RENAME TO "Notification_Type_old";
ALTER TYPE "Notification_Type_new" RENAME TO "Notification_Type";
DROP TYPE "Notification_Type_old";
COMMIT;
