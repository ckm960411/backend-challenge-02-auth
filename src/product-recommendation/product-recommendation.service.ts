import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRecommendationReqDto } from './dto/request/create-product-recommendation.request';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllProductRecommendationReqQuery } from './dto/request/find-all-product-recommendation.req.query';
import { isNil } from 'lodash';

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

    return {
      productRecommendationId: created.id,
    };
  }

  async findAllProductRecommendations(
    query: FindAllProductRecommendationReqQuery,
    userId: number,
  ) {
    const productRecommendations =
      await this.productRecommendationRepository.find({
        where: {
          userId,
          ...(!isNil(query.isCompleted) && {
            isCompleted: query.isCompleted === 't',
          }),
        },
        relations: {
          specs: true,
          products: true,
        },
      });

    return productRecommendations;
  }

  async findOneProductRecommendation(
    productRecommendationId: number,
    userId: number,
  ) {
    const productRecommendation =
      await this.productRecommendationRepository.findOne({
        where: {
          id: productRecommendationId,
          userId,
        },
        relations: {
          specs: true,
          products: true,
        },
      });

    if (isNil(productRecommendation)) {
      throw new NotFoundException('상품 추천을 찾을 수 없습니다.');
    }

    return productRecommendation;
  }

  async deleteProductRecommendation(
    productRecommendationId: number,
    userId: number,
  ) {
    const productRecommendation =
      await this.productRecommendationRepository.findOne({
        where: {
          id: productRecommendationId,
          userId,
        },
      });

    if (!productRecommendation) {
      throw new NotFoundException('상품 추천을 찾을 수 없습니다.');
    }

    await this.productRecommendationRepository.delete(productRecommendationId);
    return productRecommendation.id;
  }
}
