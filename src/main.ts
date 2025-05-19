import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import setupSwagger from './config/swagger.setup';
import initSetup from './config/init.setup';
import setupLogging from './config/logging.setup';
import { ValidationPipe } from '@nestjs/common';
import setupSeeders from './config/seeders.setup';

const SWAGGER_PATH = '/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get<number>('APP_PORT') || '3000';

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app, SWAGGER_PATH);
  initSetup(app);
  await setupSeeders(app);

  await app.listen(port);

  setupLogging(app, SWAGGER_PATH);
}

bootstrap();
