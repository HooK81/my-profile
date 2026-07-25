import {
  type EmailValidation,
  type Profile,
  profileSchema,
} from 'my-profile-shared';

import { FetchApi } from './FetchApi';

const PROFILE_ID = import.meta.env.VITE_PROFILE_ID;

class Api extends FetchApi {
  public async loadProfile(locale: string): Promise<Profile> {
    const data = await this.get<unknown>(
      `/v1/${locale}/profiles/${PROFILE_ID}`,
      {},
      { apiName: 'loadProfile' },
    );
    return profileSchema.parse(data);
  }

  public async getFile(locale: string, file: string): Promise<Blob> {
    return this.get<Blob>(
      `/v1/${locale}/profiles/${PROFILE_ID}/files/${file}`,
      {},
      { responseType: 'blob', apiName: 'getFile' },
    );
  }

  public async sendMail(payload: EmailValidation): Promise<void> {
    await this.post<void>('/v1/mails', payload, {
      showError: false,
      apiName: 'sendMail',
    });
  }

  public async getVcard(locale: string): Promise<Blob> {
    return this.get<Blob>(
      `/v1/${locale}/profiles/${PROFILE_ID}/vcard`,
      {},
      { responseType: 'blob', apiName: 'getVcard' },
    );
  }
}

export default new Api();
