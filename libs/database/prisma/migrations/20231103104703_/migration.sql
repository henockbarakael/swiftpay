/*
  Warnings:

  - You are about to drop the column `refeshToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `refeshToken`,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL;
