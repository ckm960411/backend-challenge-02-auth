import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewReqDto } from './dto/request/create-review.req.dto';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리뷰 생성' })
  async createReview(
    @Body() dto: CreateReviewReqDto,
    @User('id') userId: number,
  ) {
    return this.reviewService.createReview({
      userId,
      productId: dto.productId,
      rating: dto.rating,
      content: dto.content,
      photos: dto.photos,
    });
  }
}
