import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Wish extends BaseEntity {
  @ApiProperty({
    description: '위시 리스트 메모',
  })
  @Column()
  memo: string;

  @ApiProperty({
    description: '위시 리스트 주인',
  })
  @ManyToOne(() => User, (user) => user.wishes)
  user: User;

  @ApiProperty({
    description: '위시 리스트 상품 아이디',
  })
  @Column()
  productId: number;

  @ApiProperty({
    description: '상품',
  })
  @ManyToOne(() => Product, (product) => product.wishes)
  product: Product;
}
