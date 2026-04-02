import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import mime from 'mime';
import { Profile } from 'my-profile-shared';
import { Logger } from 'nestjs-pino';
import { Readable } from 'stream';
import VCard from 'vcard-creator';

import { ProfilesService } from './profiles.service';

const VCARD_EXT = '.vcf';

type PhotoInfo = {
  data: string;
  mime: string;
};

@Injectable()
export class VCardService {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly logger: Logger,
  ) {}

  public async getProfileVCard(
    id: string,
    disposition: string = '',
  ): Promise<StreamableFile> {
    const profile = await this.profilesService.loadProfile(id);

    const fileName = this.sanitizeFileName(profile.user.fullName) + VCARD_EXT;
    const vcard = await this.buildVcard(profile);

    return new StreamableFile(Readable.from([vcard.toString()]), {
      type: mime.getType(VCARD_EXT)!,
      disposition:
        disposition === 'attachment'
          ? `attachment; filename="${fileName}"`
          : undefined,
    });
  }

  private async buildVcard(profile: Profile): Promise<VCard> {
    try {
      const photo = await this.getPhotoInfo(profile);

      const vcard = new VCard('vcard')
        .addName(profile.user.lastName, profile.user.firstName)
        .addEmail(profile.user.email, 'PREF;HOME')
        .addPhoneNumber(
          this.sanitazePhone(profile.user.phone),
          'PREF;HOME;VOICE',
        )
        .addURL(profile.user.website, 'HOME')
        .addPhoto(photo.data, photo.mime);

      return vcard;
    } catch (error) {
      this.logger.error('Unable to generate VCard', {
        profile: profile.id,
        error: (error as Error).message,
      });

      throw new InternalServerErrorException('Unable to generate VCard');
    }
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[^\w\s.-]/g, '').trim();
  }

  private sanitazePhone(phone?: string): string {
    return phone ? phone.replace(/\([^)]+\)/g, '').replace(/ /g, '') : '';
  }

  private async getPhotoInfo(profile: Profile): Promise<PhotoInfo> {
    const photo = await this.profilesService.getProfileFile(
      profile.id,
      profile.user.image,
    );

    return {
      data: await readFile(photo.filePath, 'base64'),
      mime: photo.fileMime.replace('image/', ''),
    };
  }
}
