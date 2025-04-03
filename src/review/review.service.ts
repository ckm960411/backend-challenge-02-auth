import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { ReviewPhoto } from 'src/entities/review-photo.entity';
import { Review } from 'src/entities/review.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateReviewReqDto } from './dto/request/update-review.req.dto';
import { UserProduct } from 'src/entities/user-product.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createReview({
    userId,
    userProductId,
    rating,
    content,
    photos,
  }: {
    userId: number;
    userProductId: number;
    rating: number;
    content: string;
    photos: string[];
  }) {
    return this.dataSource.transaction(async (manager) => {
      const userProduct = await manager.findOne(UserProduct, {
        where: { id: userProductId },
      });

      if (!userProduct) {
        throw new NotFoundException('일치하는 상품이 없습니다.');
      }

      if (!!(await manager.findOne(Review, { where: { userProductId } }))) {
        throw new BadRequestException('이미 리뷰를 작성한 상품입니다.');
      }

      const review = await manager.save(Review, {
        rating: rating,
        content: content,
        userId: userId,
        user: { id: userId },
        product: { id: userProduct.productId },
        userProduct: { id: userProductId },
      });

      await manager.save(
        ReviewPhoto,
        map(photos, (photo) => ({
          url: photo,
          review: { id: review.id },
        })),
      );
    });
  }

  async getReviewsByUserId(userId: number) {
    return this.reviewRepository.find({
      where: {
        userId,
      },
      relations: {
        reviewPhotos: true,
        userProduct: {
          product: true,
          productOption: true,
        },
      },
    });
  }

  async getReviewById(id: number, userId: number) {
    return this.reviewRepository.findOne({
      where: { id, userId },
      relations: {
        reviewPhotos: true,
        userProduct: {
          product: true,
          productOption: true,
        },
      },
    });
  }

  async updateReview(id: number, userId: number, dto: UpdateReviewReqDto) {
    return this.dataSource.transaction(async (manager) => {
      const review = await manager.findOne(Review, {
        where: { id, userId },
      });

      if (!review) {
        throw new NotFoundException('리뷰를 찾을 수 없습니다.');
      }

      await manager.update(Review, id, {
        rating: dto.rating,
        content: dto.content,
      });

      if (dto.photos) {
        await manager.delete(ReviewPhoto, { review: { id } });
        await manager.save(
          ReviewPhoto,
          map(dto.photos, (photo) => ({ url: photo, review: { id } })),
        );
      }
    });
  }

  async deleteReview(id: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(ReviewPhoto, { review: { id } });
      await manager.delete(Review, { id, userId });
    });
  }
}
