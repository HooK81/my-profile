import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter';

import { MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<string>('mailer.transport')!,
        defaults: {
          from: configService.get<string>('mailer.sender')!,
        },
        template: {
          dir: `${import.meta.dirname}/templates`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
