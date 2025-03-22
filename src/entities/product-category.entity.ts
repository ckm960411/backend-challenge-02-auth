import { Column, Entity, OneToMany } from 'typeorm';
import { ProductCategoryEnum } from './enum/product-category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';
@Entity()
export class ProductCategory extends BaseEntity {
  @ApiProperty({
    description: '상품 카테고리',
    example: ProductCategoryEnum.MAC,
  })
  @Column({
    type: 'enum',
    enum: ProductCategoryEnum,
  })
  name: ProductCategoryEnum;

  @ApiProperty({
    description: '상품 카테고리 상품 목록',
    example: [],
  })
  @OneToMany(() => Product, (product) => product.productCategory)
  products?: Product[];
}
