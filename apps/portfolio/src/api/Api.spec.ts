import type { EmailValidation } from 'my-profile-shared';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

import api from './Api';
import { FetchApi } from './FetchApi';

type FetchApiMethods = {
  get(route: string, params?: object, config?: object): Promise<unknown>;
  post(route: string, data: unknown, config?: object): Promise<unknown>;
};

const PROFILE_ID = vi.hoisted(() => {
  const id = 'test-profile-id';
  vi.stubEnv('VITE_PROFILE_ID', id);
  return id;
});

vi.mock('i18next');
vi.mock('react-toastify');

describe('Api', () => {
  let getSpy: ReturnType<typeof vi.spyOn>;
  let postSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getSpy = vi.spyOn(FetchApi.prototype as unknown as FetchApiMethods, 'get');
    postSpy = vi.spyOn(
      FetchApi.prototype as unknown as FetchApiMethods,
      'post',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadProfile', () => {
    it('should call get with the correct route and return data', async () => {
      const profile = ProfileFactory.build();
      getSpy.mockResolvedValue(profile);

      const result = await api.loadProfile('en');

      expect(getSpy).toHaveBeenCalledWith(
        `/v1/en/profiles/${PROFILE_ID}`,
        {},
        { showError: false, apiName: 'loadProfile' },
      );
      expect(result).toEqual(profile);
    });
  });

  describe('getFile', () => {
    it('should call get with blob responseType and return a Blob', async () => {
      const blob = new Blob(['pdf content']);
      getSpy.mockResolvedValue(blob);

      const result = await api.getFile('en', 'resume.pdf');

      expect(getSpy).toHaveBeenCalledWith(
        `/v1/en/profiles/${PROFILE_ID}/files/resume.pdf`,
        {},
        { responseType: 'blob', apiName: 'getFile' },
      );
      expect(result).toBe(blob);
    });
  });

  describe('sendMail', () => {
    it('should call post with the correct route and payload', async () => {
      const payload: EmailValidation = {
        subject: 'Hello',
        from: 'jane@example.com',
        message: 'Hello World',
      };
      postSpy.mockResolvedValue(undefined);

      await api.sendMail(payload);

      expect(postSpy).toHaveBeenCalledWith('/v1/mails', payload, {
        showError: false,
        apiName: 'sendMail',
      });
    });
  });

  describe('getVcard', () => {
    it('should call get with blob responseType and return a Blob', async () => {
      const blob = new Blob(['vcard content']);
      getSpy.mockResolvedValue(blob);

      const result = await api.getVcard('fr');

      expect(getSpy).toHaveBeenCalledWith(
        `/v1/fr/profiles/${PROFILE_ID}/vcard`,
        {},
        { responseType: 'blob', apiName: 'getVcard' },
      );
      expect(result).toBe(blob);
    });
  });
});
