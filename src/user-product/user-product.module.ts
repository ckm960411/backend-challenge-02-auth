import { Module } from '@nestjs/common';
import { UserProductController } from './user-product.controller';
import { UserProductService } from './user-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProduct } from 'src/entities/user-product.entity';
import { Review } from 'src/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProduct, Review])],
  controllers: [UserProductController],
  providers: [UserProductService],
  exports: [UserProductService],
})
export class UserProductModule {}
