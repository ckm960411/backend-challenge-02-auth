import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductRecommendationService } from './service/product-recommendation.service';
import { CreateProductRecommendationReqDto } from './dto/request/create-product-recommendation.request';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { FindAllProductRecommendationReqQuery } from './dto/request/find-all-product-recommendation.req.query';
import { ProductRecommendation } from 'src/entities/product-recommendation.entity';
import { UpdateProductRecommendationService } from './service/update-product-recommendation.service';
import { UpdateProductRecommendationReqDto } from './dto/request/update-product-recommendation.req.dto';

@Controller('product-recommendation')
export class ProductRecommendationController {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
    private readonly updateProductRecommendationService: UpdateProductRecommendationService,
  ) {}

  @ApiOperation({
    summary: '상품 추천 생성',
    description:
      '상품에 대한 추천을 시작할 때 호출합니다. 새로운 상품 추천을 하나 생성합니다.',
  })
  @ApiBody({
    type: CreateProductRecommendationReqDto,
  })
  @ApiResponse({
    status: 201,
    description:
      '상품 추천 생성 성공시 생성된 ProductRecommendation ID와 그 다음 스텝을 반환합니다. 이후 상품추천의 내용을 하나씩 수정할 때 보내는 ID로 활용합니다.',
    example: {
      productRecommendationId: 1,
      nextStep: 'STEP_1',
      productCategories: ['Mac', 'iPad', 'iPhone', 'Watch', 'AirPods'],
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProductRecommendation(
    @User('id') userId: number,
    @Body() dto: CreateProductRecommendationReqDto,
  ): Promise<{ productRecommendationId: number }> {
    return this.productRecommendationService.createProductRecommendation(
      userId,
      dto,
    );
  }

  @ApiOperation({ summary: '유저 상품 추천 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 상품 추천 목록 조회 성공',
    type: ProductRecommendation,
    isArray: true,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: FindAllProductRecommendationReqQuery,
    @User('id') userId: number,
  ) {
    return this.productRecommendationService.findAllProductRecommendations(
      query,
      userId,
    );
  }

  @ApiOperation({ summary: '상품 추천 단건 조회' })
  @ApiParam({
    name: 'productRecommendationId',
    description: '상품 추천 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '상품 추천 단건 조회 성공',
    type: ProductRecommendation,
  })
  @Get(':productRecommendationId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('productRecommendationId') productRecommendationId: number,
    @User('id') userId: number,
  ) {
    return this.productRecommendationService.findOneProductRecommendation(
      productRecommendationId,
      userId,
    );
  }

  @ApiOperation({ summary: '상품 추천 수정' })
  @ApiParam({
    name: 'productRecommendationId',
    description: '상품 추천 ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateProductRecommendationReqDto,
  })
  @ApiResponse({
    status: 200,
    description:
      '성공시 다음 스텝을 안내하고, 유저에게 줄 수 있는 선택지를 안내합니다. 가령 minPrice가 100만원이고 maxPrice가 150만원이라면 현재 유저에게 선택해줄 수 있는 품목들의 실제 최소, 최대가격이 그러함을 응답으로 반환합니다.',
  })
  @Patch(':productRecommendationId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('productRecommendationId') productRecommendationId: number,
    @User('id') userId: number,
    @Body() dto: UpdateProductRecommendationReqDto,
  ) {
    return this.updateProductRecommendationService.updateProductRecommendation(
      userId,
      productRecommendationId,
      dto,
    );
  }

  @ApiOperation({ summary: '상품 추천 완료' })
  @ApiParam({
    name: 'productRecommendationId',
    description: '상품 추천 ID',
    example: 1,
  })
  @Post(':productRecommendationId/complete')
  @UseGuards(JwtAuthGuard)
  async complete(
    @Param('productRecommendationId') productRecommendationId: number,
    @User('id') userId: number,
  ) {
    return this.productRecommendationService.completeProductRecommendation(
      userId,
      productRecommendationId,
    );
  }

  @ApiOperation({ summary: '상품 추천 삭제' })
  @ApiParam({
    name: 'productRecommendationId',
    description: '상품 추천 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '상품 추천 삭제 성공',
  })
  @Delete(':productRecommendationId')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('productRecommendationId') productRecommendationId: number,
    @User('id') userId: number,
  ) {
    return this.productRecommendationService.deleteProductRecommendation(
      productRecommendationId,
      userId,
    );
  }
}
