import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SigninMethod } from 'src/auth/types/enum/signin-method.enum';
import { Wish } from './wish.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from './review.entity';
import { UserProduct } from './user-product.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: [SigninMethod.GOOGLE, SigninMethod.LOCAL, SigninMethod.KAKAO],
    default: SigninMethod.LOCAL,
  })
  provider: SigninMethod;

  @Column({ nullable: true })
  providerId: string;

  @ApiProperty({
    description: '위시 리스트 목록',
  })
  @OneToMany(() => Wish, (wish) => wish.user)
  @JoinColumn()
  wishes: Wish[];

  @ApiProperty({
    description: '리뷰 목록',
  })
  @OneToMany(() => Review, (review) => review.user)
  @JoinColumn()
  reviews: Review[];

  @ApiProperty({
    description: '유저 보유 상품 목록',
  })
  @OneToMany(() => UserProduct, (userProduct) => userProduct.user)
  @JoinColumn()
  userProducts: UserProduct[];
}
