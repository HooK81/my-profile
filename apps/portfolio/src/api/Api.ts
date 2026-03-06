import type { EmailValidation, Profile } from 'my-profile-shared';

import { AxiosApi } from './AxiosApi';

const PROFILE_ID = import.meta.env.VITE_PROFILE_ID;

class Api extends AxiosApi {
  public async loadProfile(locale: string): Promise<Profile> {
    const { data } = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}`,
      {},
      { apiName: 'loadProfile' },
    );
    return data as Profile;
  }

  public async getFile(locale: string, file: string): Promise<string> {
    const response = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}/files/${file}`,
      {},
      { responseType: 'blob', apiName: 'getFile' },
    );
    return URL.createObjectURL(response.data as Blob);
  }

  public async sendMail(payload: EmailValidation): Promise<void> {
    await this.post('/v1/mails', payload, {
      showError: false,
      apiName: 'sendMail',
    });
  }

  public async getVcard(locale: string): Promise<string> {
    const response = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}/vcard`,
      {},
      { responseType: 'blob', apiName: 'getVcard' },
    );
    return URL.createObjectURL(response.data as Blob);
  }
}

export default new Api();
