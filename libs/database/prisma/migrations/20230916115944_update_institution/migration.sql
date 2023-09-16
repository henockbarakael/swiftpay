/*
  Warnings:

  - You are about to alter the column `name` on the `institution` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `institution` MODIFY `name` VARCHAR(191) NOT NULL;
