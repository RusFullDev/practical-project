import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const start = async () => {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO objects
      whitelist: true, // Strip away unexpected properties from incoming objects
      forbidNonWhitelisted: true, // Throw error if unexpected properties are present
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Taxi')
    .setDescription('Taxi API Documentation')
    .setVersion('1.0')
    .addTag('Taxi')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(
      `Server started at ${PORT} | swagger -> http://localhost:${PORT}/api/docs`,
    );
  });
};

start();
