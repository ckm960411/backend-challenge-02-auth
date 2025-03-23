import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class BaseCreateProductRequest {
  @ApiProperty({
    description: '상품 이름',
    example: 'MacBook Pro 13인치',
  })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({
    description: '상품 세대',
    example: '1',
  })
  @Column()
  @IsString()
  generation: string;

  @ApiProperty({
    description: '출시일',
    example: '2025-01-01',
  })
  @Column()
  @IsString()
  releasedDate: string;

  @ApiProperty({
    description: '상품 가격',
    example: 1000000,
  })
  @Column()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '상품 두께',
    example: '1.5cm',
  })
  @Column()
  @IsString()
  thickness: string;

  @ApiProperty({
    description: '상품 무게',
    example: '1.5kg',
  })
  @Column()
  @IsString()
  weight: string;

  @ApiProperty({
    description: '상품 가로 너비',
    example: '1.5cm',
  })
  @Column()
  @IsString()
  width: string;

  @ApiProperty({
    description: '상품 세로 높이',
    example: '1.5cm',
  })
  @Column()
  @IsString()
  height: string;

  @ApiProperty({
    description: '상품 색상 목록',
    example: [{ name: '금호동 네이비', code: '#001487' }],
  })
  @Column()
  @IsArray()
  colors: { name: string; code: string }[];

  @ApiProperty({
    description: '상품 사진 목록',
    example: [{ url: 'https://example.com/photo.jpg' }],
  })
  @Column()
  @IsArray()
  photos: string[];

  @ApiProperty({
    description: '상품 태그 목록',
    example: ['MacBook Pro', '13인치', '금호동 네이비'],
  })
  @Column()
  @IsArray()
  tags: string[];
}
