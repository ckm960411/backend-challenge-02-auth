import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetProductsRequest } from './dto/request/get-products.request';
import { CreateMacProductRequest } from './dto/request/create-product/create-mac-product.request';
import { CreateProductService } from './service/create-product.service';
import { CreateIPadProductRequest } from './dto/request/create-product/create-ipad-product.request';
import { CreateIPhoneProductRequest } from './dto/request/create-product/create-iphone-product.request';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly createProductService: CreateProductService,
  ) {}

  @ApiOperation({ summary: '상품 목록 조회' })
  @Get()
  async getProducts(@Query() query: GetProductsRequest) {
    return this.productService.getProducts(query);
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
}
