import { INestApplication } from '@nestjs/common';
import * as crypto from 'crypto';
import { AccessToken } from 'my-profile-shared';
import request from 'supertest';
import { App } from 'supertest/types';

export type TestAuthToken = {
  accessToken: string;
  deviceHash: string;
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

  return {
    accessToken: (authResponse.body as AccessToken).accessToken,
    deviceHash,
  };
};

export const generateDeviceHash = (userAgent: string = '') => {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
};
