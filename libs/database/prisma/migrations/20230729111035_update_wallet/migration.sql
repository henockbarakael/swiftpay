/*
  Warnings:

  - Added the required column `currencyId` to the `merchant_wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `merchant_wallet` ADD COLUMN `currencyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `merchant_wallet` ADD CONSTRAINT `merchant_wallet_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
