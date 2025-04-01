import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserProductService } from './user-product.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateUserProductReqDto } from './dto/request/create-user-product.req.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user-product')
export class UserProductController {
  constructor(private readonly userProductService: UserProductService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 보유 상품 목록 조회' })
  async findAllUserProducts(@User('id') userId: number) {
    return this.userProductService.findAllUserProducts(userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 보유 상품 상세 조회' })
  async findUserProductById(
    @User('id') userId: number,
    @Param('id') userProductId: number,
  ) {
    return this.userProductService.findUserProductById(userId, userProductId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 보유 상품 등록' })
  async createUserProduct(
    @Body() dto: CreateUserProductReqDto,
    @User('id') userId: number,
  ) {
    return this.userProductService.createUserProduct(userId, dto);
  }
}
