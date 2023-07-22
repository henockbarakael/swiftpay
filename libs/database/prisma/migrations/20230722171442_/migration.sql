/*
  Warnings:

  - You are about to drop the column `identifier` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_identifier_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "identifier",
DROP COLUMN "isPhoneNumber",
DROP COLUMN "picture",
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
