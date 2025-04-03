import { map } from 'lodash';
import { Product } from 'src/entities/product.entity';
import { UserProduct } from 'src/entities/user-product.entity';
import { Wish } from 'src/entities/wish.entity';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { Column } from 'typeorm';

export class GetProductsResponse {
  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  generation: string;

  @Column()
  releasedDate: string;

  @Column()
  price: number;

  @Column()
  thickness: string;

  @Column()
  weight: string;

  @Column()
  width: string;

  @Column()
  height: string;

  @Column()
  colors: { name: string; code: string }[];

  @Column()
  photos: string[];

  @Column()
  tags: string[];

  @Column()
  isPurchased: boolean;

  @Column()
  userProductId: number | null;

  @Column()
  isInWish: boolean;

  @Column()
  wishId: number | null;

  constructor(
    product: WithRelations<
      Product,
      'productCategory' | 'productColors' | 'productTags' | 'productPhotos'
    >,
    userProducts: UserProduct[],
    wishes: Wish[],
  ) {
    this.id = product.id;
    this.name = product.name;
    this.category = product.productCategory.name;
    this.generation = product.generation;
    this.releasedDate = product.releasedDate;
    this.price = product.price;
    this.thickness = product.thickness;
    this.weight = product.weight;
    this.width = product.width;
    this.height = product.height;
    this.colors = map(product.productColors, (color) => ({
      name: color.name,
      code: color.code,
    }));

    const userProduct =
      userProducts?.find(
        (userProduct) => userProduct.productId === product.id,
      ) ?? null;
    this.isPurchased = !!userProduct;
    this.userProductId = userProduct?.id ?? null;

    const wish =
      wishes?.find((wish) => {
        return wish.productId === product.id;
      }) ?? null;
    this.isInWish = !!wish;
    this.wishId = wish?.id ?? null;
  }

  static of(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >,
    userProducts: UserProduct[],
    wishes: Wish[],
  ) {
    return new GetProductsResponse(product, userProducts, wishes);
  }
}
