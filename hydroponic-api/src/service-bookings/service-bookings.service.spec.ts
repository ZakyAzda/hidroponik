import { Test, TestingModule } from '@nestjs/testing';
import { ServiceBookingsService } from './service-bookings.service';

describe('ServiceBookingsService', () => {
  let service: ServiceBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceBookingsService],
    }).compile();

    service = module.get<ServiceBookingsService>(ServiceBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
