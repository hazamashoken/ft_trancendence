import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config({ path: '../.env' });
console.log('main-env:', process.env.DB_HOST);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'data'), {
    index: false,
    prefix: '/data',
  });
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Ft_Transencdence')
    .setDescription('Backend API')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'localhost')
    .addTag('Auth', 'Authentication service')
    .addTag(
      'Me',
      'Self resource endpoint, use access_token to access only specific user data',
    )
    .addTag('Users', 'Users resource endpoint, access all users in database')
    .addTag('Channels')
    .addTag(
      'FT',
      '42 resource endpoint, use to access 42 api without authentication',
    )
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.NESTJS_PORT ?? 3000);
}
bootstrap();
