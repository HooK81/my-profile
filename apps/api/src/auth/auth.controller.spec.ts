import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenDto } from 'my-profile-shared';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { generateDeviceHash } from 'test_utils/access-token';

describe('AuthController (functionnal)', () => {
  const URI = '/auth/token';
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return an access token', async () => {
    await request(app.getHttpServer())
      .get(URI)
      .set('x-device-hash', generateDeviceHash())
      .expect(HttpStatus.OK)
      .expect((res: { body: AccessTokenDto }) => {
        if (typeof res.body.accessToken !== 'string') {
          throw new Error('accessToken is missing or not a string');
        }
      });
  });

  it('should return 401 without device hash', async () => {
    await request(app.getHttpServer())
      .get(URI)
      .expect(HttpStatus.UNAUTHORIZED)
      .expect(JSON.stringify({ message: 'Unauthorized', statusCode: 401 }));
  });
});
