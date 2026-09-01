import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { initTestApp } from '../../test_utils/access-token.js';
import { AppModule } from '../app.module.js';

describe('HealthController (functionnal)', () => {
  const URI = '/health';
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initTestApp(app);
    await app.init();
  });

  it('should return healthy status', async () => {
    await request(app.getHttpServer())
      .get(URI)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect((res.body as { status: string }).status).toBe('ok');
      });
  });
});
