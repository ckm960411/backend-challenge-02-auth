import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetProductsRequest } from './dto/request/get-products.request';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 목록 조회' })
  @Get()
  async getProducts(@Query() query: GetProductsRequest) {
    return this.productService.getProducts(query);
  }
}
