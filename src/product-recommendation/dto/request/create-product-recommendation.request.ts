import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';

export class CreateProductRecommendationReqDto {
  @ApiProperty({
    description: '상품 카테고리',
    enum: ProductCategoryEnum,
  })
  @IsEnum(ProductCategoryEnum)
  category: ProductCategoryEnum;
}
