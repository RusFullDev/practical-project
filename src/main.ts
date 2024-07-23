import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const start = async () => {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: '*',
  });

  // Настройка статической папки
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

  // Настройка вебхука
  const server = express();
  server.use(bodyParser.json());

  server.post('/webhook', (req, res) => {
    const payload = req.body;

    if (payload.ref === 'refs/heads/main') { // Проверяем, что пуш произошел в основную ветку
      exec('git pull && npm install && pm2 restart all', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error: ${stderr}`);
          return res.status(500).send('Server error');
        }
        console.log(`Output: ${stdout}`);
        res.status(200).send('Webhook received and processed');
      });
    } else {
      res.status(200).send('Not the main branch');
    }
  });

  server.listen(3010, () => {
    console.log('Webhook server is running on port 3010');
  });

  await app.listen(PORT, () => {
    console.log(
      `Server started at ${PORT} | swagger -> http://localhost:${PORT}/api/docs`,
    );
  });
};

start();
