import { Test, TestingModule } from '@nestjs/testing';
import { ServicesCategoriesController } from './service-categories.controller';

describe('ServiceCategoriesController', () => {
  let controller: ServicesCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesCategoriesController],
    }).compile();

    controller = module.get<ServicesCategoriesController>(ServicesCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
