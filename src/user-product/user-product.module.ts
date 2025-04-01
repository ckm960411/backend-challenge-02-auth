import { Module } from '@nestjs/common';
import { UserProductController } from './user-product.controller';
import { UserProductService } from './user-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProduct } from 'src/entities/user-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProduct])],
  controllers: [UserProductController],
  providers: [UserProductService],
})
export class UserProductModule {}
