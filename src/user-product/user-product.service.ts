import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProduct } from 'src/entities/user-product.entity';
import { Repository } from 'typeorm';
import { CreateUserProductReqDto } from './dto/request/create-user-product.req.dto';
import { UpdateUserProductReqDto } from './dto/request/update-user-product.req.dto';
import { map } from 'lodash';
import { GetUserProductResponse } from './dto/response/get-user-product.response';
import { Review } from 'src/entities/review.entity';

@Injectable()
export class UserProductService {
  constructor(
    @InjectRepository(UserProduct)
    private userProductRepository: Repository<UserProduct>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findAllUserProducts(userId: number) {
    const userProducts = await this.userProductRepository.find({
      where: { userId },
      relations: {
        product: {
          productCategory: true,
          productTags: true,
          productSpecs: true,
          productPhotos: true,
          productColors: true,
        },
        productOption: {
          productOptionDetails: true,
        },
      },
    });

    return map(
      userProducts,
      (userProduct) => new GetUserProductResponse(userProduct),
    );
  }

  async findUserProductById(userId: number, userProductId: number) {
    const up = await this.userProductRepository.findOne({
      where: { userId, id: userProductId },
      relations: {
        product: {
          productCategory: true,
          productTags: true,
          productSpecs: true,
          productPhotos: true,
          productColors: true,
        },
        productOption: {
          productOptionDetails: true,
        },
      },
    });

    if (!up) {
      throw new NotFoundException('일치하는 상품이 없습니다.');
    }

    const reviews = await this.reviewRepository.find({
      where: { userProduct: { id: userProductId } },
      relations: {
        reviewPhotos: true,
      },
    });

    return new GetUserProductResponse(up, reviews);
  }

  async createUserProduct(userId: number, dto: CreateUserProductReqDto) {
    if (
      !!(await this.userProductRepository.findOne({
        where: {
          userId,
          productId: dto.productId,
          productOptionId: dto.productOptionId,
        },
      }))
    ) {
      throw new BadRequestException('이미 보유 상품으로 등록한 상품입니다.');
    }

    const userProduct = this.userProductRepository.create({
      userId,
      productId: dto.productId,
      productOptionId: dto.productOptionId,
      purchasedAt: dto.purchasedAt,
      purchasePrice: dto.purchasePrice,
      soldAt: dto.soldAt,
      status: dto.status,
      repurchasedCount: dto.repurchasedCount,
      condition: dto.condition,
      memo: dto.memo,
    });

    return this.userProductRepository.save(userProduct);
  }

  async updateUserProduct(
    userId: number,
    userProductId: number,
    dto: UpdateUserProductReqDto,
  ) {
    const userProduct = await this.userProductRepository.findOne({
      where: { userId, id: userProductId },
    });

    if (!userProduct) {
      throw new NotFoundException('일치하는 상품이 없습니다.');
    }

    await this.userProductRepository.update(userProductId, dto);

    return this.userProductRepository.findOne({
      where: { userId, id: userProductId },
    });
  }

  async deleteUserProduct(userId: number, userProductId: number) {
    const userProduct = await this.userProductRepository.findOne({
      where: { userId, id: userProductId },
    });

    if (!userProduct) {
      throw new NotFoundException('일치하는 상품이 없습니다.');
    }

    await this.userProductRepository.delete(userProductId);

    return userProductId;
  }
}
