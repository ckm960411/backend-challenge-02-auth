import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewReqDto {
  @ApiProperty({
    description: '상품 ID',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(5)
  @Max(5)
  rating: number;

  @IsString()
  content: string;

  @ApiProperty({
    description: '리뷰 사진 목록',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
  })
  @IsArray()
  @IsOptional()
  photos?: string[];
}
