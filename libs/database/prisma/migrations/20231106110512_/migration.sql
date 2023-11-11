-- DropForeignKey
ALTER TABLE `marchants` DROP FOREIGN KEY `marchants_institutionId_fkey`;

-- AlterTable
ALTER TABLE `marchants` MODIFY `institutionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `organizationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marchants` ADD CONSTRAINT `marchants_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
