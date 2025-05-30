import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewReqDto {
  @ApiProperty({
    description: '평점',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '갤럭시북이 더 좋음',
  })
  @IsString()
  @IsOptional()
  content?: string;

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
