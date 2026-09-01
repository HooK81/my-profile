import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { getAuthToken, initTestApp } from '../../test_utils/access-token.js';
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

  const URI = '/mails';

  it('should send an email to the team with valid payload', async () => {
    const token = await getAuthToken(app);

    return request(app.getHttpServer())
      .post(URI)
      .send({
        from: 'test@example.com',
        message: 'lorem ipsum',
      })

      .set('Cookie', token.cookie)
      .expect(HttpStatus.NO_CONTENT);
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
        .set('Cookie', token.cookie)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
