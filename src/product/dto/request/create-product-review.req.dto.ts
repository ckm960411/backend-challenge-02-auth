import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateProductReviewReqDto {
  @ApiProperty({
    description: '상품 옵션 ID',
    example: 1,
  })
  @IsNumber()
  @Column()
  productOptionId: number;

  @ApiProperty({
    description: '평점',
    example: 5,
  })
  @IsNumber()
  @Column()
  rating: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '아무리 생각해도 갤럭시북이 더 좋음',
  })
  @IsString()
  @Column()
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
