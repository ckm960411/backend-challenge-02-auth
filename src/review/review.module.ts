import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from 'src/entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewPhoto } from 'src/entities/review-photo.entity';
import { Product } from 'src/entities/product.entity';
import { UserProduct } from 'src/entities/user-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewPhoto, Product, UserProduct]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
