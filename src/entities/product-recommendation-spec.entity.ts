import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRecommendation } from './product-recommendation.entity';

@Entity()
export class ProductRecommendationSpec extends BaseEntity {
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
    description: '상품 추천 ID',
    example: 1,
  })
  @Column()
  productRecommendationId: number;

  @ApiProperty({
    description: '추천상품',
  })
  @ManyToOne(
    () => ProductRecommendation,
    (productRecommendation) => productRecommendation.specs,
  )
  productRecommendation: ProductRecommendation;
}
