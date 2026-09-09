import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import {
  getAuthToken,
  initTestApp,
  TEST_PUBLIC_APP_URL,
} from '../../test_utils/access-token.js';
import { AppModule } from '../app.module.js';

describe('Mail Controller (functionnal)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initTestApp(app);
    await app.init();
  });

  const URI = '/api/v1/mails';
  const validPayload = {
    from: 'test@example.com',
    message: 'lorem ipsum',
  };

  it('should send an email to the team with valid payload', async () => {
    const token = await getAuthToken(app);

    return request(app.getHttpServer())
      .post(URI)
      .send(validPayload)
      .set('Origin', TEST_PUBLIC_APP_URL)
      .set('Cookie', token.cookie)
      .expect(HttpStatus.NO_CONTENT);
  });

  describe('CSRF: Origin check', () => {
    it('should refuse an authenticated request without Origin', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .post(URI)
        .send(validPayload)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should refuse an authenticated request from a foreign Origin', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .post(URI)
        .send(validPayload)
        .set('Origin', 'https://evil.example')
        .set('Cookie', token.cookie)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('validation errors', () => {
    it.each([
      {},
      { from: 'not-an-email', message: 'lorem ipsum' },
      { from: 'test@crochet.com', message: 'abc' },
      { from: 'test@crochet.com', message: 1 },
      { from: 'test@crochet.com', message: 'a'.repeat(5001) },
      {
        from: 'test@crochet.com',
        message: 'lorem ipsum',
        subject: 'a'.repeat(256),
      },
    ])('shoud return a bad request response', async (payload) => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .post(URI)
        .send(payload)
        .set('Origin', TEST_PUBLIC_APP_URL)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
