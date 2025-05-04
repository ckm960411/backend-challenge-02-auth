import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';

export class UpdateProductRecommendationReqDto {
  @ApiProperty({
    description:
      '현재 진행 단계, STEP_1은 카테고리 선택단계로 필수 단계입니다.',
    example: 'STEP_1',
  })
  @IsIn(['STEP_1', 'STEP_2', 'STEP_3', 'STEP_4', 'STEP_5'])
  step: 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'STEP_5';

  @ApiProperty({
    description: '카테고리',
    example: 'Mac',
  })
  @IsEnum(ProductCategoryEnum)
  @IsOptional()
  productCategory?: ProductCategoryEnum;

  @ApiProperty({
    description: '태그 목록',
    example: ['사무용', '개발용'],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: '최소 가격',
    example: 100000,
  })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: '최대 가격',
    example: 100000,
  })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: '최소 출시일',
    example: '2024-01-01',
  })
  @IsString()
  @IsOptional()
  minReleasedDate?: string;

  @ApiProperty({
    description: '스펙 목록',
    example: [{ type: 'display_type', value: '레티나 디스플레이' }],
  })
  @IsArray()
  @IsOptional()
  specs?: { type: string; value: string }[];
}
