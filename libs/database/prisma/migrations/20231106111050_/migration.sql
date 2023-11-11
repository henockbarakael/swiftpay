/*
  Warnings:

  - You are about to drop the column `institutionId` on the `marchants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `marchants` DROP FOREIGN KEY `marchants_institutionId_fkey`;

-- AlterTable
ALTER TABLE `marchants` DROP COLUMN `institutionId`,
    ADD COLUMN `organizationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `marchants` ADD CONSTRAINT `marchants_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
