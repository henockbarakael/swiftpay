/*
  Warnings:

  - Added the required column `customerNumber` to the `daily_operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerNumber` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `daily_operation` ADD COLUMN `customerNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `customerNumber` VARCHAR(191) NOT NULL;
