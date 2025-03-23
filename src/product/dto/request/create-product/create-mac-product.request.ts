import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { BaseCreateProductRequest } from './base-create-product.request';

export class CreateMacProductRequest extends BaseCreateProductRequest {
  @ApiProperty({
    description: '디스플레이 크기',
    example: '13인치',
  })
  @Column()
  @IsString()
  displaySize: string;

  @ApiProperty({
    description: '디스플레이 가로 픽셀',
    example: '1920',
  })
  @Column()
  @IsString()
  displayHorizontalPixel: string;

  @ApiProperty({
    description: '디스플레이 세로 픽셀',
    example: '1080',
  })
  @Column()
  @IsString()
  displayVerticalPixel: string;

  @ApiProperty({
    description: '디스플레이 밝기',
    example: '100',
  })
  @Column()
  @IsString()
  displayBrightness: string;

  @ApiProperty({
    description: '상품 옵션 목록',
    example: [
      {
        additionalPrice: 10000,
        detail: { cpu: '1', gpu: '1', ram: '1', storage: '1', processor: '1' },
      },
    ],
  })
  @Column()
  @IsArray()
  options: {
    additionalPrice: number;
    detail: {
      cpu: string;
      gpu: string;
      ram: string;
      storage: string;
      processor: string;
    };
  }[];
}
