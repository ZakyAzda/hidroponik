import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// Hapus import { join } from 'path'; karena sudah tidak dipakai di sini
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Hydroponic API')
    .setDescription('API Documentation for the Hydroponic Project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // --- UPDATE CORS AGAR LEBIH AMAN UNTUK DEV ---
  app.enableCors({
    // Jika env belum diset, izinkan semua origin sementara waktu agar tidak pusing debug
    origin: process.env.FRONTEND_URL || true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();