import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductRecommendationService } from './product-recommendation.service';
import { CreateProductRecommendationReqDto } from './dto/request/create-product-recommendation.request';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('product-recommendation')
export class ProductRecommendationController {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
  ) {}

  @ApiOperation({ summary: '상품 추천 생성' })
  @ApiBody({
    type: CreateProductRecommendationReqDto,
    description:
      '상품에 대한 추천을 시작할 때 호출합니다. 새로운 상품 추천을 하나 생성합니다. body는 CreateProductRecommendationReqDto를 참고해주세요.',
  })
  @ApiResponse({
    status: 201,
    description:
      '상품 추천 생성 성공시 생성된 ProductRecommendation ID를 반환합니다. 이후 상품추천의 내용을 하나씩 수정할 때 보내는 ID로 활용합니다.',
    example: 1,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProductRecommendation(
    @Body() dto: CreateProductRecommendationReqDto,
    @User('id') userId: number,
  ): Promise<number> {
    return this.productRecommendationService.createProductRecommendation(
      dto,
      userId,
    );
  }
}
