import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductTag extends BaseEntity {
  @ApiProperty({
    description: '상품 태그 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '상품 목록',
  })
  @ManyToMany(() => Product, (product) => product.productTags)
  product?: Product[];
}
