import {
  ConflictException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { access, constants, readFile } from 'fs/promises';
import mime from 'mime';
import { Profile, profileSchema } from 'my-profile-shared';
import { Logger } from 'nestjs-pino';
import { resolve } from 'path';

import { LocaleService } from '../locale/locale.service';

export const FILES_FOLDER = 'files/';

type FileInfo = {
  filePath: string;
  fileMime: string;
};

@Injectable()
export class ProfilesService {
  constructor(
    private readonly logger: Logger,
    private readonly localeService: LocaleService,
    private readonly configService: ConfigService,
  ) {}

  public async loadProfile(id: string): Promise<Profile> {
    try {
      const raw = await readFile(this.getProfileMainFile(id), 'utf8');

      return profileSchema.parse(JSON.parse(raw));
    } catch (error) {
      this.logger.error('error while loading profile', {
        id,
        error: (error as Error).message,
      });
      const code =
        error && typeof error === 'object' && 'code' in error ? error.code : '';

      if (code) {
        throw new NotFoundException(`Profile ${id} was not found`);
      }

      throw new ConflictException(`Profile ${id} is not valid`);
    }
  }

  private getProfileMainFile(id: string): string {
    const locale = this.localeService.getLocale();
    const path = this.configService.get<string>('users_folder')!;

    return resolve(path, `${id}/profile.${locale}.json`);
  }

  public async getProfileFile(id: string, file: string): Promise<FileInfo> {
    const fileInfo = await this.getProfileFileInfo(id, file);
    if (!fileInfo) {
      this.logger.error('File not found', {
        profile: id,
        file,
      });
      throw new NotFoundException(`File ${file} not found`);
    }

    return fileInfo;
  }

  public async getProfileFileStream(
    id: string,
    file: string,
    disposition: string = '',
  ): Promise<StreamableFile> {
    const fileInfo = await this.getProfileFile(id, file);

    return new StreamableFile(createReadStream(fileInfo.filePath), {
      type: fileInfo.fileMime,
      disposition:
        disposition === 'attachment'
          ? `attachment; filename="${file}"`
          : undefined,
    });
  }

  private async getProfileFileInfo(
    id: string,
    file: string,
    isFallback: boolean = false,
  ): Promise<FileInfo | null> {
    const path = this.configService.get<string>('users_folder')!;

    const filePath = resolve(path, `${id}/${FILES_FOLDER}/${file}`);
    const fileMime = mime.getType(filePath) ?? 'text/plain';

    try {
      await access(filePath, constants.F_OK);

      return {
        filePath,
        fileMime,
      };
    } catch {
      if (!isFallback) {
        return this.getProfileFileInfo(
          id,
          this.addLocaleToFileName(file),
          true,
        );
      }

      return null;
    }
  }

  private addLocaleToFileName(fileName: string): string {
    const locale = this.localeService.getLocale();

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return `${fileName}.${locale}`;
    }

    const name = fileName.slice(0, lastDotIndex);
    const extension = fileName.slice(lastDotIndex + 1);

    return `${name}.${locale}.${extension}`;
  }
}
