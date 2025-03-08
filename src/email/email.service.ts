import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCode } from '../entities/verification-code.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  async sendVerificationCode(email: string): Promise<void> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30분 후 만료

    // 기존 인증 코드가 있다면 삭제
    await this.verificationCodeRepository.delete({ email });

    // 새로운 인증 코드 저장
    await this.verificationCodeRepository.save({
      email,
      code,
      expiresAt,
      isVerified: false,
    });

    // 이메일 발송
    await this.mailerService.sendMail({
      to: email,
      subject: '비밀번호 재설정 인증 코드',
      text: `비밀번호 재설정을 위한 인증 코드입니다: ${code}\n이 코드는 30분 후에 만료됩니다.`,
    });
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { email, code },
    });

    if (!verificationCode) {
      return false;
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.verificationCodeRepository.remove(verificationCode);
      return false;
    }

    verificationCode.isVerified = true;
    await this.verificationCodeRepository.save(verificationCode);
    return true;
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
