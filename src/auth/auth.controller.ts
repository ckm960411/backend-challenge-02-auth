import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/request/signup.request';
import { SigninRequest } from './dto/request/signin.request';
import { SigninResponse } from './dto/response/signin.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() request: SignupRequest,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.signUp({
      email: request.email,
      name: request.name,
      password: request.password,
    });
  }

  @Post('signin')
  async signin(@Body() request: SigninRequest): Promise<SigninResponse> {
    return this.authService.signIn({
      email: request.email,
      password: request.password,
    });
  }
}
