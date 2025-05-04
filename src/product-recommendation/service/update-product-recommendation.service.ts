import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { Repository } from 'typeorm';
import { ProductRecommendationService } from './product-recommendation.service';
import { ProductTag } from 'src/entities/product-tag.entity';
import { UpdateProductRecommendationReqDto } from '../dto/request/update-product-recommendation.req.dto';
import { map } from 'lodash';
import { ProductRecommendationTag } from 'src/entities/product-recommendation-tag.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class UpdateProductRecommendationService {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
    @InjectRepository(ProductRecommendationTag)
    private readonly productRecommendationTagRepository: Repository<ProductRecommendationTag>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async updateProductRecommendation(
    userId: number,
    productRecommendationId: number,
    dto: UpdateProductRecommendationReqDto,
  ) {
    switch (dto.step) {
      case 'STEP_1':
        return this.stepOne(userId, productRecommendationId, {
          productCategory: dto.productCategory,
          isCompleted: dto.isCompleted,
        });
      case 'STEP_2':
        return this.stepTwo(userId, productRecommendationId, {
          tags: dto.tags,
          isCompleted: dto.isCompleted,
        });
      case 'STEP_3':
        return this.stepThree(userId, productRecommendationId, {
          minPrice: dto.minPrice,
          maxPrice: dto.maxPrice,
          isCompleted: dto.isCompleted,
        });
      case 'STEP_4':
        return this.stepFour(userId, productRecommendationId, {
          minReleasedDate: dto.minReleasedDate,
          isCompleted: dto.isCompleted,
        });
      case 'STEP_5':
        return this.stepFive(userId, productRecommendationId, {
          specs: dto.specs,
          isCompleted: dto.isCompleted,
        });
      default:
        throw new BadRequestException('Invalid step');
    }
  }

  private async stepOne(
    userId: number,
    productRecommendationId: number,
    {
      productCategory,
      isCompleted,
    }: {
      productCategory: ProductCategoryEnum;
      isCompleted?: boolean;
    },
  ) {
    const productRecommendation =
      await this.productRecommendationService.findOneProductRecommendation(
        productRecommendationId,
        userId,
      );

    // 1-1) 카테고리 저장
    await this.productRecommendationRepository.save({
      ...productRecommendation,
      category: productCategory,
      isCompleted: isCompleted ?? undefined,
    });

    // 1-2) 최근 태그 10개 조회
    const recentProductTags = await this.productTagRepository
      .createQueryBuilder('productTag')
      .select(['productTag.name', 'productTag.createdAt'])
      .distinctOn(['productTag.name'])
      .orderBy('productTag.name', 'ASC')
      .addOrderBy('productTag.createdAt', 'DESC')
      .take(10)
      .getMany();

    return {
      productRecommendationId,
      nextStep: 'STEP_2',
      tags: map(recentProductTags, 'name'),
    };
  }

  private async stepTwo(
    userId: number,
    productRecommendationId: number,
    {
      tags,
      isCompleted,
    }: {
      tags?: string[];
      isCompleted?: boolean;
    },
  ) {
    const productRecommendation =
      await this.productRecommendationService.findOneProductRecommendation(
        productRecommendationId,
        userId,
      );

    // 2-1) 태그가 있는 경우
    if (tags) {
      // 2-2) 기존 태그 삭제
      const existingTags = await this.productRecommendationTagRepository.find({
        where: {
          productRecommendation: {
            id: productRecommendationId,
          },
        },
      });

      if (existingTags.length > 0) {
        await this.productRecommendationTagRepository.delete(
          map(existingTags, 'id'),
        );
      }

      // 2-3) 새로운 태그 저장
      for (const tag of tags) {
        await this.productRecommendationTagRepository.save({
          name: tag,
          productRecommendation: {
            id: productRecommendationId,
          },
        });
      }
    }

    // 2-4) 완료 여부 저장
    await this.productRecommendationRepository.update(
      { id: productRecommendationId },
      { isCompleted: isCompleted ?? undefined },
    );

    // 2-5) 카테고리가 일치하는 상품들의 가격 범위 찾기
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice')
      .innerJoin('product.productCategory', 'productCategory')
      .where('productCategory.name = :category', {
        category: productRecommendation.category,
      });

    // 2-6) 태그가 있는 경우 태그까지 포함하는 품목 반영
    if (tags && tags.length > 0) {
      queryBuilder
        .innerJoin('product.productTags', 'productTag')
        .andWhere('productTag.name IN (:...tags)', { tags });
    }

    const priceRange = await queryBuilder.getRawOne();

    return {
      productRecommendationId,
      nextStep: 'STEP_3',
      minPrice: priceRange?.minPrice ?? 0,
      maxPrice: priceRange?.maxPrice ?? 0,
    };
  }

  private async stepThree(
    userId: number,
    productRecommendationId: number,
    {
      minPrice,
      maxPrice,
      isCompleted,
    }: {
      minPrice?: number;
      maxPrice?: number;
      isCompleted?: boolean;
    },
  ) {}

  private async stepFour(
    userId: number,
    productRecommendationId: number,
    {
      minReleasedDate,
      isCompleted,
    }: {
      minReleasedDate?: string;
      isCompleted?: boolean;
    },
  ) {}

  private async stepFive(
    userId: number,
    productRecommendationId: number,
    {
      specs,
      isCompleted,
    }: {
      specs?: { type: string; value: string }[];
      isCompleted?: boolean;
    },
  ) {}
}
