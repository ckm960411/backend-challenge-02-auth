import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserProductService } from './user-product.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('user-product')
export class UserProductController {
  constructor(private readonly userProductService: UserProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAllUserProducts(@User('id') userId: number) {
    return this.userProductService.findAllUserProducts(userId);
  }
}
