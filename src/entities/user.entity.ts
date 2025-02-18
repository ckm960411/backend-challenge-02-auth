import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SigninMethod } from 'src/auth/types/enum/signin-method.enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: [SigninMethod.GOOGLE, SigninMethod.LOCAL, SigninMethod.KAKAO],
    default: SigninMethod.LOCAL,
  })
  provider: SigninMethod;

  @Column({ nullable: true })
  providerId: string;
}
