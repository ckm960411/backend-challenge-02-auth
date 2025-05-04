import { Module } from '@nestjs/common';
import { ProductRecommendationController } from './product-recommendation.controller';
import { ProductRecommendationService } from './service/product-recommendation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { ProductCategory } from 'src/entities/product-category.entity';
import { UpdateProductRecommendationService } from './service/update-product-recommendation.service';
import { ProductRecommendationTag } from 'src/entities/product-recommendation-tag.entity';
import { ProductTag } from 'src/entities/product-tag.entity';
import { Product } from 'src/entities/product.entity';
import { ProductRecommendationSpec } from 'src/entities/product-recommendation-spec.entity';
import { ProductToProductRecommendation } from 'src/entities/product-to-product-recommendation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRecommendation,
      ProductCategory,
      ProductTag,
      ProductRecommendationTag,
      Product,
      ProductRecommendationSpec,
      ProductToProductRecommendation,
    ]),
  ],
  controllers: [ProductRecommendationController],
  providers: [ProductRecommendationService, UpdateProductRecommendationService],
})
export class ProductRecommendationModule {}
