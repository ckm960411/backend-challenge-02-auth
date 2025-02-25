import { omit } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SigninMethod } from 'src/auth/types/enum/signin-method.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * User 조회
   */
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * User 생성
   */
  async createUser({
    name,
    email,
    password,
    provider,
    providerId,
  }: {
    name: string;
    email: string;
    password: string;
    provider?: SigninMethod;
    providerId?: string;
  }): Promise<Omit<User, 'password'>> {
    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const newUser: User = await this.userRepository.save({
      name,
      email,
      password,
      provider,
      providerId,
    });

    return omit(newUser, ['password']);
  }
}
