import { Module } from '@nestjs/common';
import { ProductRecommendationController } from './product-recommendation.controller';
import { ProductRecommendationService } from './product-recommendation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRecommendation])],
  controllers: [ProductRecommendationController],
  providers: [ProductRecommendationService],
})
export class ProductRecommendationModule {}
