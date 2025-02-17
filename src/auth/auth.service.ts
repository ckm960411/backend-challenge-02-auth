import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SigninResponse } from './dto/response/signin.response';
import { GoogleUser } from './types/google-user.interface';
import { SigninMethod } from './types/enum/signin-method.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signUp({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<Omit<User, 'password'>> {
    const SALT_ROUNDS = +this.configService.get('SALT_ROUNDS');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<SigninResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
    };
  }

  async googleSignin(user: GoogleUser) {
    if (!user) {
      throw new UnauthorizedException('Google 인증에 실패했습니다.');
    }

    let existingUser: User | Omit<User, 'password'> =
      await this.userService.findByEmail(user.email);

    if (!existingUser) {
      existingUser = await this.userService.createUser({
        name: user.name || user.email.split('@')[0], // 이름이 없으면 이메일의 앞부분 사용
        email: user.email,
        password: '', // 소셜로그인을 한 사용자는 비밀번호가 없음
        provider: SigninMethod.GOOGLE,
        providerId: user.id,
      });
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
    };
  }
}
