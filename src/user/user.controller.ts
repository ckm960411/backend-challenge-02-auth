import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as UserDecorator } from 'src/auth/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMyTierResponse } from './dto/response/get-my-tier.res.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@UserDecorator() user: User) {
    return user;
  }

  @ApiOperation({
    summary: '내 티어 조회',
    description: '내 티어를 조회합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: '내 티어 조회 응답 (GetMyTierResponse)',
    type: GetMyTierResponse,
  })
  @Get('me/tier')
  async getMyTier(@UserDecorator() user: User) {
    return this.userService.getMyTier(user.id);
  }
}
