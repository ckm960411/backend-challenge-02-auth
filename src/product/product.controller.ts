import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetProductsRequest } from './dto/request/get-products.request';
import { CreateMacProductRequest } from './dto/request/create-product/create-mac-product.request';
import { CreateProductService } from './service/create-product.service';
import { CreateIPadProductRequest } from './dto/request/create-product/create-ipad-product.request';
import { CreateIPhoneProductRequest } from './dto/request/create-product/create-iphone-product.request';
import { CreateProductReviewReqDto } from './dto/request/create-product-review.req.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User as UserDecorator } from 'src/auth/decorators/user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/strategies/optional-jwt-auth.guard';
import { User } from 'src/entities/user.entity';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly createProductService: CreateProductService,
  ) {}

  @ApiOperation({ summary: '상품 목록 조회' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getProducts(
    @Query() query: GetProductsRequest,
    @UserDecorator() user: User | null,
  ) {
    return this.productService.getProducts(query, user?.id);
  }

  @Post('category')
  async createProductCategories() {
    return this.productService.createProductCategories();
  }

  @Post('mac')
  async createMacProduct(@Body() dto: CreateMacProductRequest) {
    return this.createProductService.createMacProduct(dto);
  }

  @Post('ipad')
  async createIPadProduct(@Body() dto: CreateIPadProductRequest) {
    return this.createProductService.createIPadProduct(dto);
  }

  @Post('iphone')
  async createIPhoneProduct(@Body() dto: CreateIPhoneProductRequest) {
    return this.createProductService.createIPhoneProduct(dto);
  }

  @ApiOperation({ summary: '상품 리뷰 생성' })
  @UseGuards(JwtAuthGuard)
  @Post('/:productId/review')
  async createProductReview(
    @Param('productId') productId: number,
    @UserDecorator('id') userId: number,
    @Body() dto: CreateProductReviewReqDto,
  ) {
    return this.productService.createProductReview(productId, userId, dto);
  }
}
