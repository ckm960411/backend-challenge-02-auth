import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateWishRequest {
  @ApiProperty({
    description: '위시 리스트 메모',
  })
  @IsString()
  @Column()
  memo: string;

  @ApiProperty({
    description: '상품 ID',
  })
  @IsNumber()
  @Column()
  productId: number;
}
