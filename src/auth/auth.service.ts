import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SigninResponse } from './dto/response/signin.response';
import { GoogleUser } from './types/google-user.interface';
import { SigninMethod } from './types/enum/signin-method.enum';
import { KakaoUser } from './types/kakao-user.interface';
import { JwtPayload } from './types/jwt-payload.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '24h',
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
        name: user.firstName + ' ' + user.lastName,
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

  async kakaoSignin(user: KakaoUser) {
    if (!user) {
      throw new UnauthorizedException('Kakao 인증에 실패했습니다.');
    }

    let existingUser: User | Omit<User, 'password'> =
      await this.userService.findByEmail(user.email);

    if (!existingUser) {
      existingUser = await this.userService.createUser({
        name: user.name,
        email: user.email,
        password: '', // 소셜로그인을 한 사용자는 비밀번호가 없음
        provider: SigninMethod.KAKAO,
        providerId: user.id.toString(),
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

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const SALT_ROUNDS = +this.configService.get('SALT_ROUNDS');
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.userService.updatePassword(userId, hashedNewPassword);
  }

  async requestPasswordReset(
    email: string,
    currentPassword: string,
  ): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('해당 이메일로 가입된 사용자가 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    await this.emailService.sendVerificationCode(email);
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
    return this.emailService.verifyCode(email, code);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const isVerified = await this.emailService.verifyCode(email, code);
    if (!isVerified) {
      throw new UnauthorizedException('유효하지 않은 인증 코드입니다.');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('해당 이메일로 가입된 사용자가 없습니다.');
    }

    const SALT_ROUNDS = +this.configService.get('SALT_ROUNDS');
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.userService.updatePassword(user.id, hashedPassword);
  }
}
