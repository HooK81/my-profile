import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { promises as fs } from 'fs';
import { ProfileFactory } from 'my-profile-shared/fixtures';
import * as path from 'path';
import request from 'supertest';
import { App } from 'supertest/types';

import { getAuthToken, initTestApp } from '../../test_utils/access-token';
import { AppModule } from '../app.module';
import { FILES_FOLDER } from './profiles.service';

describe('Profiles Controller (functionnal)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initTestApp(app);
    await app.init();
  });

  const profile = ProfileFactory.build();

  const dirPath = path.resolve(process.env.USERS_FOLDER!, profile.id);
  const filePath = path.join(dirPath, 'profile.en.json');
  const pdfPath = path.join(
    path.resolve(dirPath, FILES_FOLDER),
    profile.user.resumePdf,
  );
  const imagePath = path.join(
    path.resolve(dirPath, FILES_FOLDER),
    profile.user.image,
  );
  const fileWithoutExtPath = path.join(
    path.resolve(dirPath, FILES_FOLDER),
    'file.en',
  );

  beforeAll(async () => {
    await fs.mkdir(path.resolve(dirPath, FILES_FOLDER), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(profile), 'utf-8');
    await fs.writeFile(pdfPath, 'pdf-content', 'utf-8');
    await fs.writeFile(imagePath, 'image-content', 'utf-8');
    await fs.writeFile(fileWithoutExtPath, 'file-content', 'utf-8');
  });

  afterAll(async () => {
    await fs.rm(dirPath, { recursive: true, force: true });
  });

  describe('Get profile', () => {
    const URI = '/en/profiles';

    it('should return a profile', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/${profile.id}`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          expect(response.body).toBeTruthy();
          expect(response.body).toStrictEqual(profile);
        });
    });

    it('should return an error when profile is not found', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/f119f334-f301-426e-aac9-da86d26db999`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.NOT_FOUND);
    });

    describe('invalid JSON profile', () => {
      const profileId = 'f119f334-f301-426e-aac9-da86d26db999';
      const dirPath = path.resolve(process.env.USERS_FOLDER!, profileId);
      const filePath = path.join(dirPath, 'profile.en.json');

      beforeAll(async () => {
        await fs.mkdir(dirPath, { recursive: true });
        const data = JSON.stringify({ id: 1 });
        await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
      });

      afterAll(async () => {
        await fs.rm(dirPath, { recursive: true, force: true });
      });

      it('should return a validation error when profile JSON is not valid', async () => {
        const token = await getAuthToken(app);

        await request(app.getHttpServer())
          .get(`${URI}/${profileId}`)
          .set('x-device-hash', token.deviceHash)
          .set('Cookie', token.cookie)
          .expect(HttpStatus.CONFLICT);
      });
    });
  });

  describe('Get File', () => {
    const URI = `/en/profiles/${profile.id}/files`;

    it('should return the profile PDF file', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/${profile.user.resumePdf}`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.OK)
        .expect('Content-Type', 'application/pdf')
        .expect((response) => {
          expect(response.body).toBeTruthy();
        });
    });

    it('should add Content-Disposition header when requested', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/${profile.user.resumePdf}?disposition=attachment`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.OK)
        .expect(
          'Content-Disposition',
          `attachment; filename="${profile.user.resumePdf}"`,
        );
    });

    it('should return a localized file without extension', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/file`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.OK)
        .expect('Content-Type', 'text/plain')
        .expect((response) => {
          expect(response.body).toBeTruthy();
          expect(response.text).toBe('file-content');
        });
    });

    it("should return 404 error when file doesn't exists", async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/wrong-file.pdf`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should reject path traversal in file parameter', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}/..%2F..%2F..%2Fetc%2Fpasswd`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should reject non-UUID id parameter', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`/en/profiles/..%2F..%2Fetc/files/passwd`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Get Profile VCard', () => {
    const URI = `/en/profiles/${profile.id}/vcard`;

    it('should return VCard data', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)

        .expect(HttpStatus.OK)
        .expect('Content-Type', 'text/x-vcard')
        .expect((response: request.Response) => {
          expect(response.text).toBeTruthy();
        });
    });

    it('should add Content-Disposition header when requested', async () => {
      const token = await getAuthToken(app);

      await request(app.getHttpServer())
        .get(`${URI}?disposition=attachment`)
        .set('x-device-hash', token.deviceHash)
        .set('Cookie', token.cookie)

        .expect(HttpStatus.OK)
        .expect('Content-Type', 'text/x-vcard')
        .expect(
          'Content-Disposition',
          `attachment; filename="${profile.user.fullName}.vcf"`,
        );
    });
  });
});
