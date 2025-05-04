import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class CreateProductRecommendationReqDto {
  @ApiProperty({
    description:
      '강제 생성 여부입니다. 기존에 생성된 상품 추천이 완료되지 않았어도 t를 입력할 경우 새로운 상품 추천을 생성합니다.',
    default: 'f',
    required: false,
  })
  @IsIn(['t', 'f'])
  @IsOptional()
  force?: 't' | 'f';
}
