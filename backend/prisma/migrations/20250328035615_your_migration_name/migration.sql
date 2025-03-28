/*
  Warnings:

  - The primary key for the `menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `imageURL` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.
  - The values [ADMIN] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_menutouser` DROP FOREIGN KEY `_MenuToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_menuId_fkey`;

-- AlterTable
ALTER TABLE `_menutouser` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `menu` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `imageURL`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    MODIFY `menuId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'STAFF') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuToUser` ADD CONSTRAINT `_MenuToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
