import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllProductRecommendationReqQuery } from '../dto/request/find-all-product-recommendation.req.query';
import { isNil, map } from 'lodash';
import { CreateProductRecommendationReqDto } from '../dto/request/create-product-recommendation.request';
import { ProductCategory } from 'src/entities/product-category.entity';

@Injectable()
export class ProductRecommendationService {
  constructor(
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async createProductRecommendation(
    userId: number,
    dto: CreateProductRecommendationReqDto,
  ) {
    const uncompletedProductRecommendations =
      await this.findAllProductRecommendations({ isCompleted: 'f' }, userId);

    if (uncompletedProductRecommendations.length > 0 && dto.force !== 't') {
      throw new BadRequestException('이미 생성된 상품 추천이 존재합니다.');
    }

    const productRecommendation = new ProductRecommendation();
    productRecommendation.category = null;
    productRecommendation.userId = userId;
    productRecommendation.isCompleted = false;
    const created = await this.productRecommendationRepository.save(
      productRecommendation,
    );

    const productCategories = await this.productCategoryRepository.find();

    return {
      productRecommendationId: created.id,
      nextStep: 'STEP_1',
      productCategories: map(productCategories, 'name'),
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
          tags: true,
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
          tags: true,
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
