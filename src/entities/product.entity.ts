import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { BaseEntity } from './base.entity';
import { ProductSpec } from './product-spec.entity';
import { ProductOption } from './product-option.entity';
import { ProductColor } from './product-color.entity';
import { ProductPhoto } from './product-photo.entity';
import { ProductTag } from './product-tag.entity';
import { Wish } from './wish.entity';
import { Review } from './review.entity';
import { UserProduct } from './user-product.entity';
import { ProductRecommendation } from './product-recommendation.entity';

@Entity()
export class Product extends BaseEntity {
  @ApiProperty({
    description: '상품 이름',
    example: 'MacBook Pro 13인치',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '상품 세대',
    example: '1',
  })
  @Column()
  generation: string;

  @ApiProperty({
    description: '출시일',
    example: '2025-01-01',
  })
  @Column()
  releasedDate: string;

  @ApiProperty({
    description: '상품 가격',
    example: 1000000,
  })
  @Column()
  price: number;

  @ApiProperty({
    description: '상품 두께',
    example: '1.5cm',
  })
  @Column()
  thickness: string;

  @ApiProperty({
    description: '상품 무게',
    example: '1.5kg',
  })
  @Column()
  weight: string;

  @ApiProperty({
    description: '상품 가로 너비',
    example: '1.5cm',
  })
  @Column()
  width: string;

  @ApiProperty({
    description: '상품 세로 높이',
    example: '1.5cm',
  })
  @Column()
  height: string;

  @ApiProperty({
    description: '상품 색상 목록',
  })
  @OneToMany(() => ProductColor, (productColor) => productColor.product)
  @JoinColumn()
  productColors?: ProductColor[];

  @ApiProperty({
    description: '상품 사진 목록',
  })
  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
  productPhotos?: ProductPhoto[];

  @ApiProperty({
    description: '상품 태그 목록',
  })
  @ManyToMany(() => ProductTag, (productTag) => productTag.product)
  @JoinTable({
    name: 'product_product_tag',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_tag_id',
      referencedColumnName: 'id',
    },
  })
  productTags?: ProductTag[];

  @ApiProperty({
    description: '상품 카테고리',
  })
  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
  )
  @JoinColumn()
  productCategory?: ProductCategory;

  @ApiProperty({
    description: '상품 스펙 목록',
  })
  @ManyToMany(() => ProductSpec, (productSpec) => productSpec.products)
  @JoinTable({
    name: 'product_product_spec', // 조인 테이블 이름
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_spec_id',
      referencedColumnName: 'id',
    },
  })
  productSpecs?: ProductSpec[];

  @ApiProperty({
    description: '상품 옵션 목록',
  })
  @OneToMany(() => ProductOption, (productOption) => productOption.product)
  productOptions?: ProductOption[];

  @ApiProperty({
    description: '상품 위시 목록',
  })
  @OneToMany(() => Wish, (wish) => wish.product)
  @JoinColumn()
  wishes?: Wish[];

  @ApiProperty({
    description: '상품 리뷰 목록',
  })
  @OneToMany(() => Review, (review) => review.product)
  @JoinColumn()
  reviews?: Review[];

  @ApiProperty({
    description: '유저 보유 상품 목록',
  })
  @OneToMany(() => UserProduct, (userProduct) => userProduct.product)
  @JoinColumn()
  userProducts?: UserProduct[];

  @ApiProperty({
    description: '추천상품 목록',
  })
  @OneToMany(
    () => ProductRecommendation,
    (productRecommendation) => productRecommendation.products,
  )
  @JoinColumn()
  productRecommendations: ProductRecommendation[];
}
