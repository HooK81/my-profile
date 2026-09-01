import { Module } from '@nestjs/common';

import { LocaleModule } from '../locale/locale.module.js';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';
import { VCardService } from './vcard.service.js';

@Module({
  imports: [LocaleModule],
  providers: [ProfilesService, VCardService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
