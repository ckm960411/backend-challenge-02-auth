import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as UserDecorator } from 'src/auth/decorators/user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@UserDecorator() user: User) {
    return user;
  }
}
