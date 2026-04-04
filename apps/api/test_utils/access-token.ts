import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';

export type TestAuthToken = {
  cookie: string;
};

export const initTestApp = (app: INestApplication<App>): void => {
  app.use(cookieParser());
};

export const getAuthToken = async (
  app: INestApplication<App>,
): Promise<TestAuthToken> => {
  const authResponse = await request(app.getHttpServer())
    .get('/auth/token')
    .expect(200);

  const setCookie = authResponse.headers['set-cookie'] as unknown as
    | string[]
    | undefined;
  const cookieStr = setCookie?.[0] ?? '';
  const cookie = cookieStr.split(';')[0];

  return { cookie };
};
