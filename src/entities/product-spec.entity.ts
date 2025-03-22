import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductSpec extends BaseEntity {
  @ApiProperty({
    description: '상품 스펙 타입',
    example: 'display_type',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: '상품 스펙 값',
    example: '레티나 디스플레이',
  })
  @Column()
  value: string;

  @ApiProperty({
    description: '상품 목록',
  })
  @ManyToMany(() => Product, (product) => product.productSpecs)
  products?: Product[];
}
