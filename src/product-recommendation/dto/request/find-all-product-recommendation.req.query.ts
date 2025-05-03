import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { TrueOrFalse } from 'src/auth/types/trueOrFalse.type';
import { Column } from 'typeorm';

export class FindAllProductRecommendationReqQuery {
  @ApiProperty({
    description:
      '추천 완료 여부입니다. t 또는 f 중 하나 입력시 완료 또는 미완료된 목록만 조회합니다. 입력하지 않는다면 모든 추천목록을 조회합니다.',
    example: 't',
    required: false,
  })
  @IsOptional()
  @IsIn(['t', 'f'])
  @Column()
  isCompleted?: TrueOrFalse;
}
