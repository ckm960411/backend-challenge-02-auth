import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from './review.entity';

@Entity()
export class ReviewPhoto extends BaseEntity {
  @ApiProperty({
    description: '상품 사진 URL',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: '리뷰 ID',
  })
  @Column()
  reviewId: number;

  @ApiProperty({
    description: '리뷰 목록',
  })
  @ManyToOne(() => Review, (review) => review.reviewPhotos, {
    onDelete: 'CASCADE',
  })
  review: Review;
}
