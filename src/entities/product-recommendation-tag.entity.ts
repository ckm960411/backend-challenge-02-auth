import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRecommendation } from './product-recommendation.entity';

@Entity()
export class ProductRecommendationTag extends BaseEntity {
  @ApiProperty({
    description: '상품 태그 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '추천상품',
  })
  @ManyToOne(
    () => ProductRecommendation,
    (productRecommendation) => productRecommendation.tags,
  )
  productRecommendation: ProductRecommendation;
}
