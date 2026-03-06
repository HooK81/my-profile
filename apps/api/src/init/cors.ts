import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

export function initCors(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      frameguard: { action: 'deny' },
    }),
  );

  app.enableCors({
    origin: configService.get<string | RegExp[]>('cors_origin')!,
    credentials: true,
  });
}
