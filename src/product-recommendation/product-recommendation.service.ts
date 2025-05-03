import { Injectable } from '@nestjs/common';
import { CreateProductRecommendationReqDto } from './dto/request/create-product-recommendation.request';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRecommendationService {
  constructor(
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
  ) {}

  async createProductRecommendation(
    { category }: CreateProductRecommendationReqDto,
    userId: number,
  ) {
    const productRecommendation = new ProductRecommendation();
    productRecommendation.category = category;
    productRecommendation.userId = userId;
    productRecommendation.isCompleted = false;
    const created = await this.productRecommendationRepository.save(
      productRecommendation,
    );

    return created.id;
  }
}
