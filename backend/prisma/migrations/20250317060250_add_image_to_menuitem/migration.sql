/*
  Warnings:

  - The primary key for the `menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `menu` table. All the data in the column will be lost.
  - Added the required column `category` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `Menu_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_menuId_fkey`;

-- AlterTable
ALTER TABLE `menu` DROP PRIMARY KEY,
    DROP COLUMN `authorId`,
    DROP COLUMN `image`,
    DROP COLUMN `title`,
    ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `category` ENUM('APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE') NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order` MODIFY `menuId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `_MenuToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MenuToUser_AB_unique`(`A`, `B`),
    INDEX `_MenuToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuToUser` ADD CONSTRAINT `_MenuToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuToUser` ADD CONSTRAINT `_MenuToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
