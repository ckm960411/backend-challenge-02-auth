import { Test, TestingModule } from '@nestjs/testing';
import { ProductRecommendationService } from './product-recommendation.service';

describe('ProductRecommendationService', () => {
  let service: ProductRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRecommendationService],
    }).compile();

    service = module.get<ProductRecommendationService>(
      ProductRecommendationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
