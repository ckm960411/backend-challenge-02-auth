import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from 'src/entities/product-category.entity';
import { Product } from 'src/entities/product.entity';
import { ProductOption } from 'src/entities/product-option.entity';
import { ProductOptionDetail } from 'src/entities/product-option-detail.entity';
import { ProductSpec } from 'src/entities/product-spec.entity';
import { ProductColor } from 'src/entities/product-color.entity';
import { ProductPhoto } from 'src/entities/product-photo.entity';
import { ProductTag } from 'src/entities/product-tag.entity';
import { CreateProductService } from './service/create-product.service';
import { Review } from 'src/entities/review.entity';
import { ReviewPhoto } from 'src/entities/review-photo.entity';
import { ReviewService } from 'src/review/review.service';
import { UserProduct } from 'src/entities/user-product.entity';
import { Wish } from 'src/entities/wish.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductColor,
      ProductPhoto,
      ProductSpec,
      ProductCategory,
      ProductOption,
      ProductOptionDetail,
      ProductTag,
      Review,
      ReviewPhoto,
      UserProduct,
      Wish,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CreateProductService, ReviewService],
})
export class ProductModule {}
