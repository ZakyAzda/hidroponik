-- AlterTable
ALTER TABLE `payment` MODIFY `method` ENUM('BANK_TRANSFER', 'GOPAY', 'OVO', 'COD') NOT NULL;
