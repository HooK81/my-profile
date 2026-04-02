import { Module } from '@nestjs/common';

import { LocaleModule } from '../locale/locale.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { VCardService } from './vcard.service';

@Module({
  imports: [LocaleModule],
  providers: [ProfilesService, VCardService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
