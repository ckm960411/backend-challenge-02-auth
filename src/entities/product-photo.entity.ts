import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductPhoto extends BaseEntity {
  @ApiProperty({
    description: '상품 사진 URL',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: '상품 ID',
  })
  @Column()
  productId: number;

  @ApiProperty({
    description: '상품 목록',
  })
  @ManyToOne(() => Product, (product) => product.productPhotos)
  product?: Product;
}
