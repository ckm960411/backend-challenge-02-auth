import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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

  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
