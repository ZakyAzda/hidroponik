-- DropForeignKey
ALTER TABLE `servicebooking` DROP FOREIGN KEY `ServiceBooking_serviceId_fkey`;

-- DropIndex
DROP INDEX `ServiceBooking_serviceId_fkey` ON `servicebooking`;

-- AlterTable
ALTER TABLE `servicebooking` MODIFY `notes` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ServiceBooking` ADD CONSTRAINT `ServiceBooking_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
