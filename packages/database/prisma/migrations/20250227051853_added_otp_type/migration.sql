/*
  Warnings:

  - A unique constraint covering the columns `[type,userId]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Otp_Type" AS ENUM ('Login', 'ForgotPassword', 'VerifyEmail', 'VerifyMobile');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "type" "Otp_Type" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Otp_type_userId_key" ON "Otp"("type", "userId");
