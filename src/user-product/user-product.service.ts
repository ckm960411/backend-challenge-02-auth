import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProduct } from 'src/entities/user-product.entity';
import { Repository } from 'typeorm';
import { CreateUserProductReqDto } from './dto/request/create-user-product.req.dto';

@Injectable()
export class UserProductService {
  constructor(
    @InjectRepository(UserProduct)
    private userProductRepository: Repository<UserProduct>,
  ) {}

  async findAllUserProducts(userId: number) {
    return this.userProductRepository.find({
      where: { userId },
      relations: {
        product: true,
        productOption: true,
      },
    });
  }

  async findUserProductById(userId: number, userProductId: number) {
    return this.userProductRepository.findOne({
      where: { userId, id: userProductId },
      relations: {
        product: true,
        productOption: true,
        reviews: true,
      },
    });
  }

  async createUserProduct(userId: number, dto: CreateUserProductReqDto) {
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
}
