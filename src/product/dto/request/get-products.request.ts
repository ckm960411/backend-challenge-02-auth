import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({
    description: '상품명',
    example: 'M1',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '상품 최소 가격',
    example: 100_000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({
    description: '상품 최대 가격',
    example: 100_000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
