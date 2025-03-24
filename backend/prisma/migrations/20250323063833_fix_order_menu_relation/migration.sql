/*
  Warnings:

  - You are about to alter the column `A` on the `_menutouser` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `menu` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `menu` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `menuId` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `updatedAt` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_menutouser` DROP FOREIGN KEY `_MenuToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_menuId_fkey`;

-- AlterTable
ALTER TABLE `_menutouser` MODIFY `A` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `menu` DROP PRIMARY KEY,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `menuId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuToUser` ADD CONSTRAINT `_MenuToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
