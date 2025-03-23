import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'https://backend-challenge.com',
  //     'https://api.backend-challenge.com',
  //   ],
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  //   exposedHeaders: ['Authorization'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          value: error.value,
          message: Object.values(error.constraints)[0],
        }));

        throw new BadRequestException({
          statusCode: 400,
          message: '잘못된 요청입니다',
          errors: messages,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('앱등이가되 API')
    .setDescription('앱등이가되 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
