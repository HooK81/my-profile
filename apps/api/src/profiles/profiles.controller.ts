import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Profile } from 'my-profile-shared';

import { JwtAuthGuard } from '../auth/auth.guard';
import { TIME_MS } from '../constants/time';
import { ProfilesService } from './profiles.service';
import { VCardService } from './vcard.service';

@Controller({
  path: 'profiles',
  version: '1',
})
@UseInterceptors(CacheInterceptor)
@CacheTTL(
  // v8 ignore next
  process.env.NODE_ENV !== 'production' ? 1 : TIME_MS.ONE_DAY,
)
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly vCardService: VCardService,
  ) {}

  @Get(':id')
  @CacheTTL(process.env.NODE_ENV !== 'production' ? 1 : TIME_MS.ONE_HOUR)
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<Profile> {
    return await this.profilesService.loadProfile(id);
  }

  @Get(':id/files/:file')
  async getProfileFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('file') file: string,
    @Query('disposition') disposition: string,
  ): Promise<StreamableFile> {
    return await this.profilesService.getProfileFileStream(
      id,
      file,
      disposition,
    );
  }

  @Get(':id/vcard')
  async getProfileVCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('disposition') disposition: string,
  ): Promise<StreamableFile> {
    return await this.vCardService.getProfileVCard(id, disposition);
  }
}
