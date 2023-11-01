/*
  Warnings:

  - You are about to drop the column `userId` on the `marchants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userSupportId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `marchants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `marchants` DROP FOREIGN KEY `marchants_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users_support` DROP FOREIGN KEY `users_support_userId_fkey`;

-- AlterTable
ALTER TABLE `marchants` DROP COLUMN `userId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isMerchant` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `merchantId` VARCHAR(191) NULL,
    ADD COLUMN `userSupportId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `service_name_key` ON `service`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `users_userSupportId_key` ON `users`(`userSupportId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_userSupportId_fkey` FOREIGN KEY (`userSupportId`) REFERENCES `users_support`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
