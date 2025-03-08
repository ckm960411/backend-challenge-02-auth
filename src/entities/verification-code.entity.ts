import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class VerificationCode extends BaseEntity {
  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isVerified: boolean;
}
