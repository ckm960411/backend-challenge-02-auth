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

  @ApiProperty({
    description: '정렬 기준',
    example: 'releasedDate',
    required: false,
    enum: ['releasedDate', 'price', 'reviewCount'],
    default: 'releasedDate',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['releasedDate', 'price', 'reviewCount'], {
    message: '정렬 기준은 releasedDate, price, reviewCount 중 하나여야 합니다.',
  })
  sortBy?: 'releasedDate' | 'price' | 'reviewCount';

  @ApiProperty({
    description: '정렬 방향',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: '정렬 방향은 asc 또는 desc여야 합니다.',
  })
  order?: 'asc' | 'desc';
}
