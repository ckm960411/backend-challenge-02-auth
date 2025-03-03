import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/request/signup.request';
import { SigninRequest } from './dto/request/signin.request';
import { SigninResponse } from './dto/response/signin.response';
import { GoogleAuthGuard } from './strategies/google-auth.guard';
import { GoogleRequest } from './types/google-request.interface';
import { KakaoAuthGuard } from './strategies/kakao-auth.guard';
import { KakaoRequest } from './types/kakao-request.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { User as UserDecorator } from './decorators/user.decorator';
import { ChangePasswordRequest } from './dto/request/change-password.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @UserDecorator('id') userId: number,
    @Body() request: ChangePasswordRequest,
  ): Promise<void> {
    await this.authService.changePassword(
      userId,
      request.currentPassword,
      request.newPassword,
    );
  }

  @Get('/signin/google')
  @UseGuards(GoogleAuthGuard)
  async googleSignin() {
    // 구글 로그인 페이지로 리다이렉트
    return;
  }

  @Get('/signin/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: GoogleRequest, @Res() res: Response) {
    // Google 인증이 성공하면 이 메서드가 실행됩니다
    // req.user에 Google 프로필 정보가 들어있습니다
    const { accessToken } = await this.authService.googleSignin(req.user);
    const webUrl = this.configService.get<string>('WEB_URL');
    res.redirect(`${webUrl}/auth/google/callback?accessToken=${accessToken}`);
  }

  @Get('/signin/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth() {
    // 카카오 로그인 페이지로 리다이렉트됨
    return;
  }

  @Get('/signin/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(@Req() req: KakaoRequest, @Res() res: Response) {
    const { accessToken } = await this.authService.kakaoSignin(req.user);
    const webUrl = this.configService.get<string>('WEB_URL');
    res.redirect(`${webUrl}/auth/kakao/callback?accessToken=${accessToken}`);
  }
}
