/*
  Warnings:

  - You are about to alter the column `currency` on the `currency` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `name` on the `service` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.
  - The required column `idOps` was added to the `transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_dailyOperationId_fkey`;

-- AlterTable
ALTER TABLE `currency` MODIFY `currency` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `idOps` VARCHAR(191) NOT NULL;
