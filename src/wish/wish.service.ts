import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/entities/wish.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { map } from 'lodash';
import { GetWithResponse } from './dto/response/get-with.response';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createWish(userId: number, productId: number, memo: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`ID ${productId} 상품을 찾을 수 없습니다. `);
    }

    if (
      !!(await this.wishRepository.findOne({
        where: {
          user: { id: userId },
          product: { id: productId },
        },
      }))
    ) {
      throw new BadRequestException('이미 위시리스트에 등록된 상품입니다.');
    }

    const wish = this.wishRepository.create({
      memo: memo,
      user: { id: userId },
      product: { id: productId },
    });
    return this.wishRepository.save(wish);
  }

  async findByUserId(userId: number) {
    const wishes = await this.wishRepository.find({
      where: { user: { id: userId } },
      relations: {
        product: {
          productCategory: true,
          productTags: true,
          productSpecs: true,
          productPhotos: true,
          productColors: true,
          productOptions: {
            productOptionDetails: true,
          },
        },
      },
    });
    return map(wishes, (wish) => new GetWithResponse(wish));
  }

  async deleteWish(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!wish) {
      throw new NotFoundException(`ID ${id} 위시리스트를 찾을 수 없습니다.`);
    }

    await this.wishRepository.remove(wish);
  }
}
