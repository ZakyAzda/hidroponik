import { Test, TestingModule } from '@nestjs/testing';
import { ServiceBookingsController } from './service-bookings.controller';

describe('ServiceBookingsController', () => {
  let controller: ServiceBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceBookingsController],
    }).compile();

    controller = module.get<ServiceBookingsController>(ServiceBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
