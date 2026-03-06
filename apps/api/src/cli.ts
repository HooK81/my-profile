import { CommandFactory } from 'nest-commander';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await CommandFactory.createWithoutRunning(AppModule, [
    'warn',
    'error',
  ]);
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  await CommandFactory.runApplication(app);

  await app.close();
}

void bootstrap();
