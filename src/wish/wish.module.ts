import { Module } from '@nestjs/common';
import { WishController } from './wish.controller';
import { WishService } from './wish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  controllers: [WishController],
  providers: [WishService],
})
export class WishModule {}
