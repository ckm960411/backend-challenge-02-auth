import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';

export class UpdateProductRecommendationReqDto {
  @IsIn(['STEP_1', 'STEP_2', 'STEP_3', 'STEP_4', 'STEP_5'])
  step: 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'STEP_5';

  @IsEnum(ProductCategoryEnum)
  @IsOptional()
  productCategory?: ProductCategoryEnum;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsString()
  @IsOptional()
  minReleasedDate?: string;

  @IsArray()
  @IsOptional()
  specs?: { type: string; value: string }[];
}
