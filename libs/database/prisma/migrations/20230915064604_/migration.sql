/*
  Warnings:

  - You are about to drop the column `name` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `user_roles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `user_roles_slug_key` ON `user_roles`;

-- AlterTable
ALTER TABLE `user_roles` DROP COLUMN `name`,
    DROP COLUMN `slug`;
