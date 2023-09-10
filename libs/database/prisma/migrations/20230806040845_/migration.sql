/*
  Warnings:

  - You are about to drop the column `tel` on the `institution` table. All the data in the column will be lost.
  - Added the required column `phone` to the `institution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountStatusId` to the `users_support` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `institution` DROP COLUMN `tel`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users_support` ADD COLUMN `accountStatusId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `users_support` ADD CONSTRAINT `users_support_accountStatusId_fkey` FOREIGN KEY (`accountStatusId`) REFERENCES `account_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
