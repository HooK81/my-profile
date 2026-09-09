import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module.js';
import { setupApp } from './init/setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  setupApp(app);

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

await bootstrap();
