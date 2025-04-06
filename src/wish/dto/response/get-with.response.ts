import { Wish } from 'src/entities/wish.entity';
import { GetOneProductResponse } from 'src/product/dto/response/get-one-product.response';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { Column } from 'typeorm';

export class GetWithResponse {
  @Column()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  memo: string;

  @Column()
  productId: number;

  @Column()
  product: GetOneProductResponse;

  constructor(wish: WithRelations<Wish, 'product'>) {
    this.id = wish.id;
    this.createdAt = wish.createdAt;
    this.memo = wish.memo;
    this.productId = wish.productId;
    this.product = GetOneProductResponse.of(
      wish.product,
      wish.product.productOptions,
    );
  }
}
