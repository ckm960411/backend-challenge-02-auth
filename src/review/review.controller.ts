import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewReqDto } from './dto/request/create-review.req.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UpdateReviewReqDto } from './dto/request/update-review.req.dto';

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
      userProductId: dto.userProductId,
      rating: dto.rating,
      content: dto.content,
      photos: dto.photos,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리뷰 목록 조회' })
  async getReviewsByUserId(@User('id') userId: number) {
    return this.reviewService.getReviewsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리뷰 상세 조회' })
  async getReviewById(@Param('id') id: number, @User('id') userId: number) {
    const review = await this.reviewService.getReviewById(id, userId);
    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }
    return review;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리뷰 수정' })
  async updateReview(
    @Param('id') id: number,
    @User('id') userId: number,
    @Body() dto: UpdateReviewReqDto,
  ) {
    return this.reviewService.updateReview(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리뷰 삭제' })
  async deleteReview(@Param('id') id: number, @User('id') userId: number) {
    return this.reviewService.deleteReview(id, userId);
  }
}
