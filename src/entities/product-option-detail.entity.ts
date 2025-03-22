import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOption } from './product-option.entity';

@Entity()
export class ProductOptionDetail extends BaseEntity {
  @ApiProperty({
    description: '옵션 상세 타입',
    example: 'cpu_core',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: '옵션 상세 값',
    example: 8,
  })
  @Column()
  value: string;

  @ApiProperty({
    description: '상품 옵션 ID',
  })
  @Column()
  productOptionId: number;

  @ApiProperty({
    description: '상품 옵션',
  })
  @ManyToOne(
    () => ProductOption,
    (productOption) => productOption.productOptionDetails,
  )
  @JoinColumn()
  productOption?: ProductOption;
}
