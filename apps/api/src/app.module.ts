import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { configuration, envFilePath } from './config/configuration';
import validate from './config/env.validation';
import createLoggerConfig from './init/pino';
import { LocaleInterceptor } from './locale/locale.interceptor';
import { LocaleModule } from './locale/locale.module';
import { MailModule } from './mail/mail.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HeadersService } from './response/headers.service';
import { ResponseInterceptor } from './response/response.interceptor';

@Module({
  imports: [
    LoggerModule.forRoot(createLoggerConfig(process.env.NODE_ENV!)),
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      envFilePath,
      load: [configuration],
    }),
    LocaleModule,
    AuthModule,
    RouterModule.register([
      {
        path: ':locale',
        module: ProfilesModule,
      },
    ]),
    ProfilesModule,
    MailModule,
  ],
  providers: [
    HeadersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LocaleInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
