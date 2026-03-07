import {
  type EmailValidation,
  type Profile,
  profileSchema,
} from 'my-profile-shared';

import { AxiosApi } from './AxiosApi';

const PROFILE_ID = import.meta.env.VITE_PROFILE_ID;

class Api extends AxiosApi {
  public async loadProfile(locale: string): Promise<Profile> {
    const { data } = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}`,
      {},
      { apiName: 'loadProfile' },
    );
    return profileSchema.parse(data);
  }

  public async getFile(locale: string, file: string): Promise<Blob> {
    const response = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}/files/${file}`,
      {},
      { responseType: 'blob', apiName: 'getFile' },
    );
    return response.data as Blob;
  }

  public async sendMail(payload: EmailValidation): Promise<void> {
    await this.post('/v1/mails', payload, {
      showError: false,
      apiName: 'sendMail',
    });
  }

  public async getVcard(locale: string): Promise<Blob> {
    const response = await this.get(
      `/v1/${locale}/profiles/${PROFILE_ID}/vcard`,
      {},
      { responseType: 'blob', apiName: 'getVcard' },
    );
    return response.data as Blob;
  }
}

export default new Api();
