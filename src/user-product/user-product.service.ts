import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProduct } from 'src/entities/user-product.entity';
import { Repository } from 'typeorm';

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
}
