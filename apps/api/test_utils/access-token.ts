import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';

export type TestAuthToken = {
  cookie: string;
  deviceHash: string;
};

export const initTestApp = (app: INestApplication<App>): void => {
  app.use(cookieParser());
};

export const getAuthToken = async (
  app: INestApplication<App>,
  userAgent: string = '',
): Promise<TestAuthToken> => {
  const deviceHash = generateDeviceHash(userAgent);
  const authResponse = await request(app.getHttpServer())
    .get('/auth/token')
    .set('x-device-hash', deviceHash)
    .expect(200);

  const setCookie = authResponse.headers['set-cookie'] as unknown as
    | string[]
    | undefined;
  const cookieStr = setCookie?.[0] ?? '';
  const cookie = cookieStr.split(';')[0];

  return { cookie, deviceHash };
};

export const generateDeviceHash = (userAgent: string = '') => {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
};
