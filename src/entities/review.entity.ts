import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ReviewPhoto } from './review-photo.entity';

@Entity()
export class Review extends BaseEntity {
  @ApiProperty({
    description: '평점',
  })
  @Min(0)
  @Max(5)
  @IsNumber()
  @Column({
    default: 0,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 내용',
  })
  @IsString()
  @Column()
  content: string;

  @ApiProperty({
    description: '리뷰 작성자 ID',
  })
  @Column({ nullable: true })
  userId: number | null;

  @ApiProperty({
    description: '리뷰 작성자',
  })
  @ManyToOne(() => User, (user) => user.reviews)
  @ApiProperty({
    description: '리뷰 사진 목록',
  })
  @OneToMany(() => ReviewPhoto, (reviewPhoto) => reviewPhoto.review)
  @JoinColumn()
  reviewPhotos?: ReviewPhoto[];
  user: User;

  @ApiProperty({
    description: '상품',
  })
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
