/*
  Warnings:

  - You are about to alter the column `action` on the `audit_log` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to alter the column `currency` on the `currency` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `name` on the `institution` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - The primary key for the `marchants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `action` on the `merchant_commission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to alter the column `action` on the `merchant_wallet_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to alter the column `name` on the `service` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - The primary key for the `users_support` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `merchant_wallet` DROP FOREIGN KEY `merchant_wallet_merchantId_fkey`;

-- DropForeignKey
ALTER TABLE `merchant_wallet_parameter` DROP FOREIGN KEY `merchant_wallet_parameter_merchantId_fkey`;

-- AlterTable
ALTER TABLE `audit_log` MODIFY `action` ENUM('DEBIT', 'CREDIT') NOT NULL;

-- AlterTable
ALTER TABLE `currency` MODIFY `currency` ENUM('USD', 'EUR', 'CDF') NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE `institution` MODIFY `name` ENUM('AFRICELL', 'AIRTEL', 'ORANGE', 'VODACOM') NOT NULL;

-- AlterTable
ALTER TABLE `marchants` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `merchant_commission` MODIFY `action` ENUM('DEBIT', 'CREDIT') NOT NULL;

-- AlterTable
ALTER TABLE `merchant_wallet` MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchant_wallet_history` MODIFY `action` ENUM('DEBIT', 'CREDIT') NOT NULL;

-- AlterTable
ALTER TABLE `merchant_wallet_parameter` MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `permissionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `name` ENUM('AFRICELL', 'AIRTEL', 'ORANGE', 'VODACOM') NOT NULL;

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

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet_parameter` ADD CONSTRAINT `merchant_wallet_parameter_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `notifications_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
