import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { BaseCreateProductRequest } from './base-create-product.request';

export class CreateIPadProductRequest extends BaseCreateProductRequest {
  @ApiProperty({
    description: '프로세서',
    example: 'M4',
  })
  @Column()
  @IsString()
  processor: string;

  @ApiProperty({
    description: '네트워크',
    example: 'WiFi + Cellular',
  })
  @Column()
  @IsString()
  network: string;

  @ApiProperty({
    description: '디스플레이 크기',
    example: '11인치',
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
    example: '1920',
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
    example: [{ additionalPrice: 10000, detail: { storage: '128GB' } }],
  })
  @Column()
  @IsArray()
  options: {
    additionalPrice: number;
    detail: {
      storage: string;
    };
  }[];
}
