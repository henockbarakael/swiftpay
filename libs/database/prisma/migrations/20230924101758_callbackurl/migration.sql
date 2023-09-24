-- AlterTable
ALTER TABLE `daily_operation` ADD COLUMN `callbackUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `callbackUrl` VARCHAR(191) NULL;
