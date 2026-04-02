import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { initCors } from './init/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  initCors(app);

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

void bootstrap();
