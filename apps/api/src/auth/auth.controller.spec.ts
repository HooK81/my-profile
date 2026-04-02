import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { generateDeviceHash, initTestApp } from '../../test_utils/access-token';
import { AppModule } from '../app.module';

describe('AuthController (functionnal)', () => {
  const URI = '/auth/token';
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initTestApp(app);
    await app.init();
  });

  it('should set an access_token cookie', async () => {
    await request(app.getHttpServer())
      .get(URI)
      .set('x-device-hash', generateDeviceHash())
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toEqual({ authenticated: true });
        const cookies = res.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('access_token=');
        expect(cookies[0]).toContain('HttpOnly');
        expect(cookies[0]).toContain('Path=/');
      });
  });

  it('should return 401 without device hash', async () => {
    await request(app.getHttpServer())
      .get(URI)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect(JSON.stringify({ message: 'Unauthorized', statusCode: 401 }));
  });
});
