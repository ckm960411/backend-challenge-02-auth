import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

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
}
