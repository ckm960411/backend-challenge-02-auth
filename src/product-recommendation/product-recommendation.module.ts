import { Module } from '@nestjs/common';
import { ProductRecommendationController } from './product-recommendation.controller';
import { ProductRecommendationService } from './service/product-recommendation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { ProductCategory } from 'src/entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRecommendation, ProductCategory])],
  controllers: [ProductRecommendationController],
  providers: [ProductRecommendationService],
})
export class ProductRecommendationModule {}
