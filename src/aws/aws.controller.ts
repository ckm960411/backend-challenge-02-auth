import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { ApiOperation } from '@nestjs/swagger';
import { GenerateUploadUrlReqDto } from './dto/request/generate-upload-url.req.dto';

@Controller('aws')
export class AwsController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-url')
  @ApiOperation({
    summary: '이미지 업로드용 presigned URL 발급',
    description:
      '프론트엔드에서 직접 AWS S3에 이미지를 업로드하기 위해서 사전인증된 URL을 요청하는 API입니다. 요청 body는 GenerateUploadUrlReqDto를 참고하세요.',
  })
  async getPresignedUrl(@Body() dto: GenerateUploadUrlReqDto) {
    return await this.s3Service.generateUploadURL(dto?.extension ?? 'webp');
  }
}
