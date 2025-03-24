/*
  Warnings:

  - You are about to drop the column `available` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `available`,
    DROP COLUMN `image`,
    ADD COLUMN `imageURL` VARCHAR(191) NULL;
