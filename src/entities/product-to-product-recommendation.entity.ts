import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ProductRecommendation } from './product-recommendation.entity';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class ProductToProductRecommendation extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.productRecommendations)
  @JoinColumn()
  product: Product;

  @ManyToOne(
    () => ProductRecommendation,
    (productRecommendation) => productRecommendation.products,
  )
  @JoinColumn()
  productRecommendation: ProductRecommendation;
}
