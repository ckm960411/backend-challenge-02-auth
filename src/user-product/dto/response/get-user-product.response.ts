import { ApiProperty } from '@nestjs/swagger';
import { map } from 'lodash';
import { UserProductCondition } from 'src/entities/enum/user-product-condition.enum';
import { UserProductStatus } from 'src/entities/enum/user-product-status.enum';
import { Review } from 'src/entities/review.entity';
import { UserProduct } from 'src/entities/user-product.entity';
import { GetOneProductResponse } from 'src/product/dto/response/get-one-product.response';
import { ReviewResponse } from 'src/review/dto/response/get-review.response';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { Column } from 'typeorm';

export class GetUserProductResponse {
  @ApiProperty({
    description: '유저 보유 상품 ID',
    example: 1,
  })
  @Column()
  id: number;

  @ApiProperty({
    description: '구매일',
    example: '2025-01-01',
    nullable: true,
  })
  @Column()
  purchasedAt: string | null;

  @ApiProperty({
    description: '구매금액',
    example: 1000000,
    nullable: true,
  })
  @Column()
  purchasePrice: number | null;

  @ApiProperty({
    description: '판매(처분)일',
    example: '2025-01-01',
    nullable: true,
  })
  @Column()
  soldAt: string | null;

  @ApiProperty({
    description: '보유 상태',
    example: 'ACTIVE',
    enum: [
      UserProductStatus.ACTIVE,
      UserProductStatus.INACTIVE,
      UserProductStatus.SOLD,
    ],
    default: UserProductStatus.ACTIVE,
  })
  @Column()
  status: UserProductStatus;

  @ApiProperty({
    description: '재구매횟수',
    example: 1,
    default: 0,
  })
  @Column()
  repurchasedCount: number;

  @ApiProperty({
    description: '상품 상태',
    example: 'NEW',
    enum: [
      UserProductCondition.NEW,
      UserProductCondition.GOOD,
      UserProductCondition.FAIR,
      UserProductCondition.POOR,
      UserProductCondition.DAMAGED,
    ],
    default: UserProductCondition.NEW,
  })
  @Column()
  condition: UserProductCondition;

  @ApiProperty({
    description: '사용자 메모',
    example: '메모',
    nullable: true,
  })
  @Column()
  memo: string | null;

  @ApiProperty({
    description: '상품',
  })
  @Column()
  product: GetOneProductResponse;

  @ApiProperty({
    description: '리뷰 목록',
  })
  reviews: ReviewResponse[];

  constructor(
    userProduct: WithRelations<UserProduct, 'product' | 'productOption'>,
    reviews?: Review[],
  ) {
    this.id = userProduct.id;
    this.purchasedAt = userProduct.purchasedAt;
    this.purchasePrice = userProduct.purchasePrice;
    this.soldAt = userProduct.soldAt;
    this.status = userProduct.status;
    this.repurchasedCount = userProduct.repurchasedCount;
    this.condition = userProduct.condition;
    this.memo = userProduct.memo;
    this.product = GetOneProductResponse.of(userProduct.product, [], {
      myOption: userProduct.productOption,
    });
    this.reviews = map(reviews, (review) => new ReviewResponse(review));
  }
}
