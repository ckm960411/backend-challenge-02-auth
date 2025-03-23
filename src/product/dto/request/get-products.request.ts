import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { values } from 'lodash';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';

export class GetProductsRequest {
  @ApiProperty({
    enum: ProductCategoryEnum,
    description: '제품 카테고리',
    example: ProductCategoryEnum.MAC, // 실제 enum 값 중 하나를 예시로 넣어주세요
    required: true,
  })
  @IsEnum(ProductCategoryEnum, {
    message: `카테고리 값이 올바르지 않습니다. 카테고리 값: ${values(ProductCategoryEnum).join(', ')}`,
  })
  category!: ProductCategoryEnum;

  @ApiProperty({
    description: '태그',
    example: '웹개발',
    required: false,
  })
  @IsString()
  @IsOptional()
  tag?: string;
}
