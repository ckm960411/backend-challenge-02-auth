import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { GetProductsResponse } from './dto/response/get-products.response';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { ProductOption } from 'src/entities/product-option.entity';
import { filter, groupBy, map } from 'lodash';
import { ProductCategory } from 'src/entities/product-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async getProducts({
    category,
    tag,
  }: {
    category: ProductCategoryEnum;
    tag?: string;
  }) {
    const products: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >[] = await this.productRepository.find({
      where: {
        productCategory: { name: category },
        productTags: tag ? { name: tag } : undefined,
      },
      relations: {
        productCategory: true,
        productColors: true,
        productTags: true,
        productSpecs: true,
        productPhotos: true,
      },
    });

    const productOptions: WithRelations<
      ProductOption,
      'productOptionDetails'
    >[] = await this.productOptionRepository.find({
      where: {
        productId: In(products.map((product) => product.id)),
      },
      relations: {
        productOptionDetails: true,
      },
    });

    const groupedOptionsByProductId = groupBy(productOptions, 'productId');

    return products.map((product) =>
      GetProductsResponse.of(product, groupedOptionsByProductId[product.id]),
    );
  }

  async createProductCategories() {
    const productCategories = await this.productCategoryRepository.find();

    const alreadyCreated = map(productCategories, 'name');
    const notCreated = filter(
      ProductCategoryEnum,
      (category) => !alreadyCreated.includes(category),
    );

    return this.productCategoryRepository.save(
      map(notCreated, (category) => ({ name: category })),
    );
  }
}
