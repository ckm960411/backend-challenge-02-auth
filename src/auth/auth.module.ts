import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { GoogleAuthGuard } from './strategies/google-auth.guard';
import { JwtKakaoStrategy } from './strategies/jwt-social-kakao.strategy';
import { KakaoAuthGuard } from './strategies/kakao-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGoogleStrategy,
    GoogleAuthGuard,
    JwtKakaoStrategy,
    KakaoAuthGuard,
    JwtStrategy,
  ],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
