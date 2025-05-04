import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateProductRecommendationService {
  constructor(
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
  ) {}
}
