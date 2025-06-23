import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export enum UserTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  GRANDMASTER = 'GRANDMASTER',
}

export class GetMyTierResponse {
  @ApiProperty({
    description: '티어',
    example: 'BRONZE',
    enum: UserTier,
  })
  @Column({ enum: UserTier })
  tier: UserTier;

  @ApiProperty({
    description: '총합 포인트',
    example: 100,
  })
  @Column()
  totalPoint: number;

  @ApiProperty({
    description: '얼마나 많은 기기를 구매했는지 (현재보유 3점, 과거보유 1점)',
    example: 100,
  })
  @Column()
  productCountPoint: number;

  @ApiProperty({
    description: '얼마나 많은 돈을 썼는지 (100만원당 1점)',
    example: 100,
  })
  @Column()
  productPricePoint: number;

  @ApiProperty({
    description: '얼마나 오래 사용했는지 (10년당 1점)',
    example: 100,
  })
  @Column()
  purchasedYearPoint: number;

  @ApiProperty({
    description:
      '현재 보유 기기 기준 얼마나 많은 카테고리(생태계)를 꾸리고 있는지 (카테고리 개수의 제곱)',
    example: 100,
  })
  @Column()
  categoryPoint: number;
}
