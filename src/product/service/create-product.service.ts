import { InjectDataSource } from '@nestjs/typeorm';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { ProductCategory } from 'src/entities/product-category.entity';
import { ProductColor } from 'src/entities/product-color.entity';
import { ProductOptionDetail } from 'src/entities/product-option-detail.entity';
import { ProductOption } from 'src/entities/product-option.entity';
import { ProductPhoto } from 'src/entities/product-photo.entity';
import { ProductSpec } from 'src/entities/product-spec.entity';
import { ProductTag } from 'src/entities/product-tag.entity';
import { Product } from 'src/entities/product.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import { CreateMacProductRequest } from '../dto/request/create-product/create-mac-product.request';
import { BadRequestException, Injectable } from '@nestjs/common';
import { entries, map } from 'lodash';
import { BaseCreateProductRequest } from '../dto/request/create-product/base-create-product.request';
import { CreateIPadProductRequest } from '../dto/request/create-product/create-ipad-product.request';
import { CreateIPhoneProductRequest } from '../dto/request/create-product/create-iphone-product.request';
@Injectable()
export class CreateProductService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createMacProduct(dto: CreateMacProductRequest) {
    return this.dataSource.transaction(async (manager) => {
      const productCategory = await this.createCategoryIfNotExists(
        manager,
        ProductCategoryEnum.MAC,
      );

      const product = await this.createProduct(manager, dto, productCategory);
      await this.createProductColors(manager, product, dto.colors);
      await this.createProductPhotos(manager, product, dto.photos);
      await this.createProductTags(manager, product, dto.tags);

      const productSpecs = await manager.save(ProductSpec, [
        {
          type: 'displaySize',
          value: dto.displaySize,
        },
        {
          type: 'displayHorizontalPixel',
          value: dto.displayHorizontalPixel,
        },
        {
          type: 'displayVerticalPixel',
          value: dto.displayVerticalPixel,
        },
        {
          type: 'displayBrightness',
          value: dto.displayBrightness,
        },
      ]);
      await manager.save(Product, {
        id: product.id,
        productSpecs,
      });

      for (const option of dto.options) {
        const productOption = await manager.save(ProductOption, {
          product,
          additionalPrice: option.additionalPrice,
        });

        await manager.save(
          ProductOptionDetail,
          map(entries(option.detail), ([type, value]) => ({
            type,
            value,
            productOption,
          })),
        );
      }
    });
  }

  async createIPadProduct(dto: CreateIPadProductRequest) {
    return this.dataSource.transaction(async (manager) => {
      const productCategory = await this.createCategoryIfNotExists(
        manager,
        ProductCategoryEnum.IPAD,
      );

      const product = await this.createProduct(manager, dto, productCategory);
      await this.createProductColors(manager, product, dto.colors);
      await this.createProductPhotos(manager, product, dto.photos);
      await this.createProductTags(manager, product, dto.tags);

      const productSpecs = await manager.save(ProductSpec, [
        {
          type: 'displaySize',
          value: dto.displaySize,
        },
        {
          type: 'displayHorizontalPixel',
          value: dto.displayHorizontalPixel,
        },
        {
          type: 'displayVerticalPixel',
          value: dto.displayVerticalPixel,
        },
        {
          type: 'displayBrightness',
          value: dto.displayBrightness,
        },
        {
          type: 'processor',
          value: dto.processor,
        },
        {
          type: 'network',
          value: dto.network,
        },
      ]);
      await manager.save(Product, {
        id: product.id,
        productSpecs,
      });

      for (const option of dto.options) {
        const productOption = await manager.save(ProductOption, {
          product,
          additionalPrice: option.additionalPrice,
        });

        await manager.save(
          ProductOptionDetail,
          map(entries(option.detail), ([type, value]) => ({
            type,
            value,
            productOption,
          })),
        );
      }
    });
  }

  async createIPhoneProduct(dto: CreateIPhoneProductRequest) {
    return this.dataSource.transaction(async (manager) => {
      const productCategory = await this.createCategoryIfNotExists(
        manager,
        ProductCategoryEnum.IPHONE,
      );

      const product = await this.createProduct(manager, dto, productCategory);
      await this.createProductColors(manager, product, dto.colors);
      await this.createProductPhotos(manager, product, dto.photos);
      await this.createProductTags(manager, product, dto.tags);

      const productSpecs = await manager.save(ProductSpec, [
        {
          type: 'displaySize',
          value: dto.displaySize,
        },
        {
          type: 'displayHorizontalPixel',
          value: dto.displayHorizontalPixel,
        },
        {
          type: 'displayVerticalPixel',
          value: dto.displayVerticalPixel,
        },
        {
          type: 'displayBrightness',
          value: dto.displayBrightness,
        },
        {
          type: 'processor',
          value: dto.processor,
        },
      ]);
      await manager.save(Product, {
        id: product.id,
        productSpecs,
      });

      for (const option of dto.options) {
        const productOption = await manager.save(ProductOption, {
          product,
          additionalPrice: option.additionalPrice,
        });

        await manager.save(
          ProductOptionDetail,
          map(entries(option.detail), ([type, value]) => ({
            type,
            value,
            productOption,
          })),
        );
      }
    });
  }

  private async createCategoryIfNotExists(
    manager: EntityManager,
    name: ProductCategoryEnum,
  ) {
    const productCategory = await manager.findOne(ProductCategory, {
      where: { name },
    });

    if (!productCategory) {
      throw new BadRequestException(`${name} 카테고리 없음`);
    }

    return productCategory;
  }

  private async createProduct(
    manager: EntityManager,
    params: BaseCreateProductRequest,
    productCategory: ProductCategory,
  ) {
    const product = await manager.save(Product, {
      ...params,
      productCategory,
    });

    return product;
  }

  private async createProductColors(
    manager: EntityManager,
    product: Product,
    colors: { name: string; code: string }[],
  ) {
    await manager.save(
      ProductColor,
      map(colors, (color) => ({
        name: color.name,
        code: color.code,
        product,
      })),
    );
  }

  private async createProductPhotos(
    manager: EntityManager,
    product: Product,
    photos: string[],
  ) {
    await manager.save(
      ProductPhoto,
      map(photos, (url) => ({ url, product })),
    );
  }

  private async createProductTags(
    manager: EntityManager,
    product: Product,
    tags: string[],
  ) {
    // 1. 기존 태그 찾기
    const existingTags = await manager.find(ProductTag, {
      where: {
        name: In(tags),
      },
    });

    // 2. 새로 생성해야 할 태그 이름 필터링
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tags.filter((name) => !existingTagNames.includes(name));

    // 3. 새로운 태그 생성
    const newTags = await manager.save(
      ProductTag,
      newTagNames.map((name) => ({ name })),
    );

    // 4. 기존 태그와 새 태그 합치기
    const allTags = [...existingTags, ...newTags];

    // 5. 다대다 관계 설정
    await manager.save(Product, {
      id: product.id,
      productTags: allTags,
    });
  }
}
