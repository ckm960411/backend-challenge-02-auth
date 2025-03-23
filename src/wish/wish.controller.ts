import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishRequest } from './dto/request/create-wish.request';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('wish')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '위시 리스트 생성' })
  async createWish(@Body() dto: CreateWishRequest, @User('id') userId: number) {
    return this.wishService.createWish(userId, dto.productId, dto.memo);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 위시 리스트 조회' })
  async getWishes(@User('id') userId: number) {
    return this.wishService.findByUserId(userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '위시 리스트 삭제' })
  async deleteWish(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    return this.wishService.deleteWish(id, userId);
  }
}
