import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserProductService } from './user-product.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateUserProductReqDto } from './dto/request/create-user-product.req.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateUserProductReqDto } from './dto/request/update-user-product.req.dto';

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

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '유저 보유 상품 수정' })
  async updateUserProduct(
    @User('id') userId: number,
    @Param('id') userProductId: number,
    @Body() dto: UpdateUserProductReqDto,
  ) {
    return this.userProductService.updateUserProduct(
      userId,
      userProductId,
      dto,
    );
  }
}
