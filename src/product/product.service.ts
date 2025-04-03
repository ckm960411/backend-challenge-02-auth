import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { Product } from 'src/entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { GetProductsResponse } from './dto/response/get-products.response';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { ProductOption } from 'src/entities/product-option.entity';
import { filter, groupBy, map } from 'lodash';
import { ProductCategory } from 'src/entities/product-category.entity';
import { CreateProductReviewReqDto } from './dto/request/create-product-review.req.dto';
import { Review } from 'src/entities/review.entity';
import { ReviewPhoto } from 'src/entities/review-photo.entity';
import { UserProduct } from 'src/entities/user-product.entity';
import { GetProductsRequest } from './dto/request/get-products.request';
import { Wish } from 'src/entities/wish.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewPhoto)
    private readonly reviewPhotoRepository: Repository<ReviewPhoto>,
    @InjectRepository(UserProduct)
    private readonly userProductRepository: Repository<UserProduct>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getProducts({ category, tag }: GetProductsRequest, userId?: number) {
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

    const userProducts = userId
      ? await this.userProductRepository.find({
          where: {
            userId,
          },
        })
      : [];

    const wishes = userId
      ? await this.wishRepository.find({
          where: { user: { id: userId } },
        })
      : [];

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
      GetProductsResponse.of(
        product,
        userProducts,
        wishes,
        groupedOptionsByProductId[product.id],
      ),
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

  async createProductReview(
    productId: number,
    userId: number,
    dto: CreateProductReviewReqDto,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    const productOption = await this.productOptionRepository.findOne({
      where: { id: dto.productOptionId },
    });

    if (!productOption) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    return this.dataSource.transaction(async (manager) => {
      let userProduct = await manager.findOne(UserProduct, {
        where: {
          productId: product.id,
          productOptionId: productOption.id,
        },
      });

      if (!userProduct) {
        userProduct = await manager.save(UserProduct, {
          userId,
          productId: product.id,
          productOptionId: productOption.id,
        });
      }

      await manager.save(Review, {
        userId,
        rating: dto.rating,
        content: dto.content,
        reviewPhotos: dto.photos
          ? map(dto.photos, (photo) => ({
              url: photo,
            }))
          : undefined,
        product: { id: product.id },
        userProduct: { id: userProduct.id },
      });
    });
  }
}
