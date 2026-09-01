import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { getAuthToken, initTestApp } from '../../test_utils/access-token.js';
import { AppModule } from '../app.module.js';

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

  it('should reject a token used from a different device', async () => {
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .get('/en/profiles/00000000-0000-0000-0000-000000000000')
      .set('Cookie', token.cookie)
      .set('User-Agent', 'spoofed-agent')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
