import { Test, TestingModule } from '@nestjs/testing';
import { ProductRecommendationController } from './product-recommendation.controller';

describe('ProductRecommendationController', () => {
  let controller: ProductRecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductRecommendationController],
    }).compile();

    controller = module.get<ProductRecommendationController>(ProductRecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
