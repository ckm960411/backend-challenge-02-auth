import { Module } from '@nestjs/common';
import { ProductRecommendationController } from './product-recommendation.controller';
import { ProductRecommendationService } from './product-recommendation.service';

@Module({
  controllers: [ProductRecommendationController],
  providers: [ProductRecommendationService]
})
export class ProductRecommendationModule {}
