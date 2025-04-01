import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';
import { ProductOptionDetail } from './product-option-detail.entity';
import { UserProduct } from './user-product.entity';

@Entity()
export class ProductOption extends BaseEntity {
  @ApiProperty({
    description: '옵션별 추가 가격',
    example: 172000,
  })
  @Column()
  additionalPrice: number;

  @ApiProperty({
    description: '상품 ID',
  })
  @Column()
  productId: number;

  @ApiProperty({
    description: '상품',
  })
  @ManyToOne(() => Product, (product) => product.productOptions)
  product?: Product;

  @ApiProperty({
    description: '상품 옵션 상세 목록',
  })
  @OneToMany(
    () => ProductOptionDetail,
    (productOptionDetail) => productOptionDetail.productOption,
  )
  productOptionDetails?: ProductOptionDetail[];

  @OneToMany(() => UserProduct, (userProduct) => userProduct.productOption)
  @JoinColumn()
  userProducts?: UserProduct[];
}
