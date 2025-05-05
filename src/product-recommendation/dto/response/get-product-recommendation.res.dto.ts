import { ApiProperty } from '@nestjs/swagger';
import { map } from 'lodash';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Product } from 'src/entities/product.entity';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';

export class GetProductRecommendationResDto {
  @ApiProperty({
    description: '상품 추천 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '상품 추천 생성일시',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '상품 추천 수정일시',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '상품 추천 완료 여부',
    example: true,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: '상품 추천 카테고리',
    example: 'Mac',
    nullable: true,
  })
  category: ProductCategoryEnum | null;

  @ApiProperty({
    description: '추천 최소가격',
    example: 100000,
    nullable: true,
  })
  minPrice: number | null;

  @ApiProperty({
    description: '추천 최대가격',
    example: 1000000,
    nullable: true,
  })
  maxPrice: number | null;

  @ApiProperty({
    description: '추천 최소출시일',
    example: '2025-01-01',
    nullable: true,
  })
  minReleasedDate: string | null;

  @ApiProperty({
    description: '상품 추천 태그',
    example: ['사무용', '영상 편집', '좌청룡'],
  })
  tags: string[];

  @ApiProperty({
    description: '상품 추천 스펙',
    example: [{ type: 'RAM', value: '16GB' }],
  })
  specs: { type: string; value: string }[];

  @ApiProperty({
    description: '추천 상품',
    example: [
      {
        id: 15,
        createdAt: '2025-03-23T02:33:35.924Z',
        updatedAt: '2025-03-23T02:33:35.924Z',
        name: '테스트맥상품',
        generation: '테스트세대',
        releasedDate: '1996-04-11',
        price: 1400000,
        thickness: '1.5cm',
        weight: '1.5kg',
        width: '33cm',
        height: '20cm',
      },
    ],
  })
  products: Product[];

  constructor(
    productRecommendation: WithRelations<
      ProductRecommendation,
      'tags' | 'specs' | 'products'
    >,
  ) {
    this.id = productRecommendation.id;
    this.createdAt = productRecommendation.createdAt;
    this.updatedAt = productRecommendation.updatedAt;
    this.isCompleted = productRecommendation.isCompleted;
    this.category = productRecommendation.category;
    this.minPrice = productRecommendation.minPrice;
    this.maxPrice = productRecommendation.maxPrice;
    this.minReleasedDate = productRecommendation.minReleasedDate;
    this.tags = map(productRecommendation.tags, 'name');
    this.specs = map(productRecommendation.specs, (spec) => ({
      type: spec.type,
      value: spec.value,
    }));
    this.products = map(productRecommendation.products, 'product');
  }
}
