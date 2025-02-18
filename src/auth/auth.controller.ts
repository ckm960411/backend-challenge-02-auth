import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/request/signup.request';
import { SigninRequest } from './dto/request/signin.request';
import { SigninResponse } from './dto/response/signin.response';
import { GoogleAuthGuard } from './strategies/google-auth.guard';
import { GoogleRequest } from './types/google-request.interface';
import { KakaoAuthGuard } from './strategies/kakao-auth.guard';
import { KakaoRequest } from './types/kakao-request.interface';

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

  @Get('/signin/google')
  @UseGuards(GoogleAuthGuard)
  async googleSignin() {
    // 구글 로그인 페이지로 리다이렉트
    return;
  }

  @Get('/signin/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: GoogleRequest) {
    // Google 인증이 성공하면 이 메서드가 실행됩니다
    // req.user에 Google 프로필 정보가 들어있습니다
    return this.authService.googleSignin(req.user);
  }

  @Get('/signin/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth() {
    // 카카오 로그인 페이지로 리다이렉트됨
    return;
  }

  @Get('/signin/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(@Req() req: KakaoRequest) {
    return this.authService.kakaoSignin(req.user);
  }
}
