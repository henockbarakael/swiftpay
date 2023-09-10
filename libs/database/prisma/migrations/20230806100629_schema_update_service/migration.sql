/*
  Warnings:

  - The primary key for the `marchants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users_support` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[key]` on the table `marchants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `marchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyId` to the `merchant_wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `merchant_wallet` DROP FOREIGN KEY `merchant_wallet_merchantId_fkey`;

-- DropForeignKey
ALTER TABLE `merchant_wallet_parameter` DROP FOREIGN KEY `merchant_wallet_parameter_merchantId_fkey`;

-- AlterTable
ALTER TABLE `marchants` DROP PRIMARY KEY,
    ADD COLUMN `key` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `merchant_wallet` ADD COLUMN `currencyId` VARCHAR(191) NOT NULL,
    MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchant_wallet_parameter` MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users_support` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `notifications_type` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `marchants_key_key` ON `marchants`(`key`);

-- CreateIndex
CREATE UNIQUE INDEX `service_name_key` ON `service`(`name`);

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet_parameter` ADD CONSTRAINT `merchant_wallet_parameter_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `notifications_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
