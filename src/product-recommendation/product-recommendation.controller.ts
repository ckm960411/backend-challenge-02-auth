import { Controller } from '@nestjs/common';
import { ProductRecommendationService } from './product-recommendation.service';

@Controller('product-recommendation')
export class ProductRecommendationController {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
  ) {}
}
