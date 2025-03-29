import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { Product } from 'src/entities/product.entity';
import { ReviewPhoto } from 'src/entities/review-photo.entity';
import { Review } from 'src/entities/review.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewPhoto)
    private readonly reviewPhotoRepository: Repository<ReviewPhoto>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createReview({
    userId,
    productId,
    rating,
    content,
    photos,
  }: {
    userId: number;
    productId: number;
    rating: number;
    content: string;
    photos: string[];
  }) {
    return this.dataSource.transaction(async (manager) => {
      const review = await manager.save(Review, {
        rating: rating,
        content: content,
        userId: userId,
        user: { id: userId },
        product: { id: productId },
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
    });
  }
}
