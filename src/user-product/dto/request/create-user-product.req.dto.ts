import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserProductCondition } from 'src/entities/enum/user-product-condition.enum';
import { UserProductStatus } from 'src/entities/enum/user-product-status.enum';

export class CreateUserProductReqDto {
  @ApiProperty({
    description: '상품 ID',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: '상품 옵션 ID',
    example: 1,
  })
  @IsNumber()
  productOptionId: number;

  @ApiProperty({
    description: '구매일',
    example: '2025-01-01',
  })
  @IsString()
  purchasedAt?: string;

  @ApiProperty({
    description: '구매금액',
    example: 1000000,
  })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({
    description: '판매(처분)일',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsString()
  soldAt?: string;

  @ApiProperty({
    description: '상태',
    example: 'ACTIVE',
    default: UserProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserProductStatus)
  status?: UserProductStatus;

  @ApiProperty({
    description: '재구매횟수',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  repurchasedCount?: number;

  @ApiProperty({
    description: '상태',
    example: 'NEW',
    default: UserProductCondition.NEW,
  })
  @IsOptional()
  @IsEnum(UserProductCondition)
  condition?: UserProductCondition;

  @ApiProperty({
    description: '사용자 메모',
    example: '메모',
  })
  @IsOptional()
  @IsString()
  memo?: string;
}
