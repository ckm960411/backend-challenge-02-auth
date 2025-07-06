import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { Repository } from 'typeorm';
import { ProductRecommendationService } from './product-recommendation.service';
import { ProductTag } from 'src/entities/product-tag.entity';
import { UpdateProductRecommendationReqDto } from '../dto/request/update-product-recommendation.req.dto';
import { flatMap, isNil, map, uniqBy } from 'lodash';
import { ProductRecommendationTag } from 'src/entities/product-recommendation-tag.entity';
import { Product } from 'src/entities/product.entity';
import { ProductRecommendationSpec } from 'src/entities/product-recommendation-spec.entity';

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
    @InjectRepository(ProductRecommendationSpec)
    private readonly productRecommendationSpecRepository: Repository<ProductRecommendationSpec>,
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
        });
      case 'STEP_2':
        return this.stepTwo(userId, productRecommendationId, {
          tags: dto.tags,
        });
      case 'STEP_3':
        return this.stepThree(userId, productRecommendationId, {
          minPrice: dto.minPrice,
          maxPrice: dto.maxPrice,
        });
      case 'STEP_4':
        return this.stepFour(userId, productRecommendationId, {
          minReleasedDate: dto.minReleasedDate,
        });
      case 'STEP_5':
        return this.stepFive(userId, productRecommendationId, {
          specs: dto.specs,
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
    }: {
      productCategory: ProductCategoryEnum;
    },
  ) {
    // 1-1) 카테고리 저장
    await this.productRecommendationRepository.update(
      { id: productRecommendationId },
      { category: productCategory },
    );

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
    }: {
      tags?: string[];
    },
  ) {
    await this.checkCategory(productRecommendationId, userId);

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

    // 2-4) 카테고리가 일치하는 상품들의 가격 범위 찾기
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice')
      .innerJoin('product.productCategory', 'productCategory')
      .where('productCategory.name = :category', {
        category: productRecommendation.category,
      });

    // 2-5) 태그가 있는 경우 태그까지 포함하는 품목 반영
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
    }: {
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    await this.checkCategory(productRecommendationId, userId);
    const productRecommendation =
      await this.productRecommendationService.findOneProductRecommendation(
        productRecommendationId,
        userId,
      );

    // 3-1) 최소 가격 저장
    await this.productRecommendationRepository.update(
      { id: productRecommendationId },
      { minPrice, maxPrice },
    );

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select('product.releasedDate', 'minReleasedDate')
      .innerJoin('product.productCategory', 'productCategory')
      .where('productCategory.name = :category', {
        category: productRecommendation.category,
      });

    // // 3-2) 가격 범위가 있는 경우 가격 조건 추가
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // 3-3) 태그가 있는 경우 태그까지 포함하는 품목 반영
    if (productRecommendation.tags.length > 0) {
      queryBuilder
        .innerJoin('product.productTags', 'productTag')
        .andWhere('productTag.name IN (:...tags)', {
          tags: productRecommendation.tags,
        });
    }

    // 3-4) 출시일이 가장 빠른 상품 찾기
    queryBuilder.orderBy('product.releasedDate', 'ASC').limit(1);

    const queryResult = await queryBuilder.getRawOne();

    return {
      productRecommendationId,
      nextStep: 'STEP_4',
      minReleasedDate: queryResult?.minReleasedDate ?? null,
    };
  }

  private async stepFour(
    userId: number,
    productRecommendationId: number,
    {
      minReleasedDate,
    }: {
      minReleasedDate?: string;
    },
  ) {
    await this.checkCategory(productRecommendationId, userId);
    const productRecommendation =
      await this.productRecommendationService.findOneProductRecommendation(
        productRecommendationId,
        userId,
      );

    // 4-1) 완료 여부 저장
    await this.productRecommendationRepository.update(
      { id: productRecommendationId },
      { minReleasedDate },
    );

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.releasedDate',
      ])
      .leftJoinAndSelect('product.productSpecs', 'productSpec')
      .innerJoin('product.productCategory', 'productCategory')
      .where('productCategory.name = :category', {
        category: productRecommendation.category,
      });

    // 4-2) 가격 범위가 있는 경우 가격 조건 추가
    if (!isNil(productRecommendation.minPrice)) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: productRecommendation.minPrice,
      });
    }
    if (!isNil(productRecommendation.maxPrice)) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: productRecommendation.maxPrice,
      });
    }

    // 4-3) 태그가 있는 경우 태그까지 포함하는 품목 반영
    if (productRecommendation.tags.length > 0) {
      queryBuilder
        .innerJoin('product.productTags', 'productTag')
        .andWhere('productTag.name IN (:...tags)', {
          tags: productRecommendation.tags,
        });
    }

    // 4-4) 출시일이 있는 경우 출시일 조건 추가
    if (minReleasedDate !== undefined) {
      queryBuilder.andWhere('product.releasedDate >= :minReleasedDate', {
        minReleasedDate,
      });
    }

    console.log('SQL Query:', queryBuilder.getQueryAndParameters());
    const products = await queryBuilder.getMany();

    // 4-5) 모든 상품의 스펙을 수집
    const allSpecs = flatMap(products, 'productSpecs');
    const mappedSpecs = map(allSpecs, (spec) => ({
      type: spec.type,
      value: spec.value,
    }));
    const uniqueSpecs = uniqBy(
      mappedSpecs,
      (spec) => `${spec.type}-${spec.value}`,
    );

    return {
      productRecommendationId,
      nextStep: 'STEP_5',
      specs: uniqueSpecs,
    };
  }

  private async stepFive(
    userId: number,
    productRecommendationId: number,
    {
      specs,
    }: {
      specs?: { type: string; value: string }[];
    },
  ) {
    await this.checkCategory(productRecommendationId, userId);
    // 5-1) 기존 스펙 삭제
    await this.productRecommendationSpecRepository.delete({
      productRecommendation: {
        id: productRecommendationId,
      },
    });

    // 5-2) 새로운 스펙 저장
    for (const spec of specs) {
      await this.productRecommendationSpecRepository.save({
        type: spec.type,
        value: spec.value,
        productRecommendation: {
          id: productRecommendationId,
        },
      });
    }

    return {
      productRecommendationId,
      nextStep: null,
    };
  }

  private async checkCategory(productRecommendationId: number, userId: number) {
    const productRecommendation =
      await this.productRecommendationService.findOneProductRecommendation(
        productRecommendationId,
        userId,
      );

    if (isNil(productRecommendation.category)) {
      throw new BadRequestException('카테고리가 선택되지 않았습니다.');
    }
  }
}
