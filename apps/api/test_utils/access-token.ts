import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { setupApp } from '../src/init/setup-app.js';

export const TEST_PUBLIC_APP_URL = 'http://localhost:5173';

export type TestAuthToken = {
  cookie: string;
};

export const initTestApp = (app: INestApplication<App>): void => {
  setupApp(app);
};

export const getAuthToken = async (
  app: INestApplication<App>,
): Promise<TestAuthToken> => {
  const authResponse = await request(app.getHttpServer())
    .post('/api/v1/auth/token')
    .set('Origin', TEST_PUBLIC_APP_URL)
    .expect(HttpStatus.OK);

  const setCookie = authResponse.headers['set-cookie'] as unknown as
    | string[]
    | undefined;
  const cookieStr = setCookie?.[0] ?? '';
  const cookie = cookieStr.split(';')[0];

  return { cookie };
};
