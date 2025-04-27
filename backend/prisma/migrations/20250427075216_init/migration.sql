/*
  Warnings:

  - You are about to drop the column `tableId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_tableId_fkey`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `tableId`;

-- DropTable
DROP TABLE `table`;
