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
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
