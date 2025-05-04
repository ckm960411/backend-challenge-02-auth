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
import { Product } from 'src/entities/product.entity';
import { ProductToProductRecommendation } from 'src/entities/product-to-product-recommendation.entity';

@Injectable()
export class ProductRecommendationService {
  constructor(
    @InjectRepository(ProductRecommendation)
    private readonly productRecommendationRepository: Repository<ProductRecommendation>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductToProductRecommendation)
    private readonly productToProductRecommendationRepository: Repository<ProductToProductRecommendation>,
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

  async completeProductRecommendation(
    userId: number,
    productRecommendationId: number,
  ) {
    const productRecommendation = await this.findOneProductRecommendation(
      productRecommendationId,
      userId,
    );

    // 1) 추천 상품 찾기
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.productCategory', 'productCategory')
      .where('productCategory.name = :category', {
        category: productRecommendation.category,
      });

    // 2) 가격 범위가 있는 경우 가격 조건 추가
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

    // 3) 출시일이 있는 경우 출시일 조건 추가
    if (!isNil(productRecommendation.minReleasedDate)) {
      queryBuilder.andWhere('product.releasedDate >= :minReleasedDate', {
        minReleasedDate: productRecommendation.minReleasedDate,
      });
    }

    // 4) 태그가 있는 경우 태그 조건 추가
    if (productRecommendation.tags.length > 0) {
      queryBuilder
        .innerJoin('product.productTags', 'productTag')
        .andWhere('productTag.name IN (:...tags)', {
          tags: map(productRecommendation.tags, 'name'),
        });
    }

    // 5) 스펙이 있는 경우 스펙 조건 추가
    if (productRecommendation.specs.length > 0) {
      queryBuilder
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('1')
            .from('product_product_spec', 'pps')
            .innerJoin('product_spec', 'ps', 'ps.id = pps.product_spec_id')
            .where('pps.product_id = product.id')
            .andWhere('ps.type IN (:...types)')
            .andWhere('ps.value IN (:...values)')
            .getQuery();

          return `EXISTS ${subQuery}`;
        })
        .setParameter(
          'types',
          productRecommendation.specs.map((spec) => spec.type),
        )
        .setParameter(
          'values',
          productRecommendation.specs.map((spec) => spec.value),
        );
    }

    const recommendedProducts = await queryBuilder.getMany();

    // 6) 추천 상품 연결
    for (const product of recommendedProducts) {
      await this.productToProductRecommendationRepository.save({
        product: { id: product.id },
        productRecommendation: {
          id: productRecommendation.id,
        },
      });
    }

    // 7) 상품 추천 완료 처리
    productRecommendation.isCompleted = true;
    await this.productRecommendationRepository.update(
      productRecommendation.id,
      { isCompleted: true },
    );

    return productRecommendation.id;
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
