import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserProductStatus } from './enum/user-product-status.enum';
import { UserProductCondition } from './enum/user-product-condition.enum';
import { ProductOption } from './product-option.entity';
import { User } from './user.entity';
import { Review } from './review.entity';

@Entity()
export class UserProduct extends BaseEntity {
  @ApiProperty({
    description: '구매일',
    example: '2025-01-01',
  })
  @Column({ nullable: true })
  purchasedAt: string | null;

  @ApiProperty({
    description: '판매(처분)일',
    example: '2025-01-01',
    nullable: true,
  })
  @Column({ nullable: true })
  soldAt: string | null;

  @ApiProperty({
    description: '구매금액',
    example: 1000000,
    nullable: true,
  })
  @Column({ nullable: true })
  purchasePrice: number | null;

  @ApiProperty({
    description: '상태',
    example: 'ACTIVE',
    default: UserProductStatus.ACTIVE,
  })
  @Column({ enum: UserProductStatus, default: UserProductStatus.ACTIVE })
  status: UserProductStatus;

  @ApiProperty({
    description: '재구매횟수',
    example: 1,
    default: 0,
  })
  @Column({ default: 0 })
  repurchasedCount: number;

  @ApiProperty({
    description: '상태',
    example: 'NEW',
    default: UserProductCondition.NEW,
  })
  @Column({ enum: UserProductCondition, default: UserProductCondition.NEW })
  condition: UserProductCondition;

  @ApiProperty({
    description: '사용자 메모',
    example: '메모',
  })
  @Column({ nullable: true })
  memo: string | null;

  @ApiProperty({
    description: '상품 ID',
    example: 1,
  })
  @Column()
  productId: number;

  @ApiProperty({
    description: '상품',
  })
  @ManyToOne(() => Product, (product) => product.userProducts)
  product: Product;

  @ApiProperty({
    description: '상품 옵션 ID',
    example: 1,
  })
  @Column()
  productOptionId: number;

  @ApiProperty({
    description: '상품 옵션',
  })
  @ManyToOne(() => ProductOption, (productOption) => productOption.userProducts)
  productOption: ProductOption;

  @ApiProperty({
    description: '유저 ID',
    example: 1,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: '유저',
  })
  @ManyToOne(() => User, (user) => user.userProducts)
  user: User;

  @ApiProperty({
    description: '리뷰 목록',
  })
  @OneToMany(() => Review, (review) => review.userProduct)
  @JoinColumn()
  reviews: Review[];
}
