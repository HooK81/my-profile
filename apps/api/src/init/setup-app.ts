import { INestApplication, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

/**
 * Everything the HTTP app needs beyond the module graph. Shared by main.ts
 * and the supertest helpers so tests exercise the production URLs
 * (`/api/v1/...`), cookie parsing and security headers.
 */
export function setupApp(app: INestApplication): void {
  // Leading slash required: Nest mounts its 404 handler on the raw prefix,
  // and Express never matches a mount path without one.
  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });

  app.use(cookieParser());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      frameguard: { action: 'deny' },
    }),
  );
}
