


import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Impor Swagger



async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);



  app.useGlobalPipes(new ValidationPipe());



  // Konfigurasi Swagger

  const config = new DocumentBuilder()

    .setTitle('Hydroponic API')

    .setDescription('API Documentation for the Hydroponic Project')

    .setVersion('1.0')

    .addBearerAuth() // <-- Tambahkan ini jika Anda menggunakan otentikasi JWT

    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document); // <-- Dokumentasi tersedia di /api-docs



    app.enableCors({



      origin: process.env.FRONTEND_URL,



      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',



      credentials: true,



    });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000);

}

bootstrap();
