import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { AwsController } from './aws.controller';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [S3Service, S3Client],
  exports: [S3Service],
  controllers: [AwsController],
})
export class AwsModule {}
