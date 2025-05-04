import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProductCategoryEnum } from './enum/product-category.enum';
import { ProductRecommendationTag } from './product-recommendation-tag.entity';
import { ProductRecommendationSpec } from './product-recommendation-spec.entity';
import { User } from './user.entity';
import { ProductToProductRecommendation } from './product-to-product-recommendation.entity';

@Entity()
export class ProductRecommendation extends BaseEntity {
  @ApiProperty({
    description: '상품 카테고리',
    example: 'Mac',
  })
  @Column({ nullable: true })
  @IsEnum(ProductCategoryEnum)
  category: ProductCategoryEnum | null;

  @ApiProperty({
    description: '추천상품 입력완료 여부',
    example: 'false',
    default: false,
  })
  @Column()
  isCompleted: boolean;

  @ApiProperty({
    description: '상품 태그(용도) 목록',
    example: ['사무용', '개발용', '디자인용', '영상 편집'],
  })
  @OneToMany(
    () => ProductRecommendationTag,
    (productRecommendationTag) =>
      productRecommendationTag.productRecommendation,
  )
  tags: ProductRecommendationTag[];

  @ApiProperty({
    description: '최소 가격',
    example: 100_000,
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  minPrice: number | null;

  @ApiProperty({
    description: '최대 가격',
    example: 100_000,
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  maxPrice: number | null;

  @ApiProperty({
    description: '최소 출시일',
    example: '2022-01-01',
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  minReleasedDate: string | null;

  @ApiProperty({
    description: '스펙 목록',
  })
  @OneToMany(
    () => ProductRecommendationSpec,
    (productRecommendationSpec) =>
      productRecommendationSpec.productRecommendation,
  )
  @JoinColumn()
  specs: ProductRecommendationSpec[];

  @ApiProperty({
    description: '유저 ID',
    example: 1,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: '유저',
    example: 1,
  })
  @ManyToOne(() => User, (user) => user.productRecommendations, { lazy: true })
  user: Promise<User>;

  @ApiProperty({
    description: '상품 목록',
  })
  @OneToMany(
    () => ProductToProductRecommendation,
    (productToProductRecommendation) =>
      productToProductRecommendation.productRecommendation,
  )
  @JoinColumn()
  products: ProductToProductRecommendation[];
}
