import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserProduct } from 'src/entities/user-product.entity';
import { UserProductService } from 'src/user-product/user-product.service';
import { Review } from 'src/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProduct, Review]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserProductService],
  exports: [UserService],
})
export class UserModule {}
