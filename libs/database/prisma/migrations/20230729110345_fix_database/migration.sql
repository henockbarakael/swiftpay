/*
  Warnings:

  - The primary key for the `marchants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `merchant_wallet` DROP FOREIGN KEY `merchant_wallet_merchantId_fkey`;

-- DropForeignKey
ALTER TABLE `merchant_wallet_parameter` DROP FOREIGN KEY `merchant_wallet_parameter_merchantId_fkey`;

-- AlterTable
ALTER TABLE `marchants` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `merchant_wallet` MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchant_wallet_parameter` MODIFY `merchantId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant_wallet_parameter` ADD CONSTRAINT `merchant_wallet_parameter_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `marchants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
