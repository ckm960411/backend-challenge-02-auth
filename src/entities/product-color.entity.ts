import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductColor extends BaseEntity {
  @ApiProperty({
    description: '상품 색상',
    example: '퍼시픽 블루',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '색상 코드',
    example: '#001487',
  })
  @Column()
  code: string;

  @ApiProperty({
    description: '상품 목록',
  })
  @ManyToOne(() => Product, (product) => product.productColors)
  product?: Product;
}
