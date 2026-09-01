import { CacheModule } from '@nestjs/cache-manager';
import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module.js';
import { configuration, envFilePath } from './config/configuration.js';
import validate from './config/env.validation.js';
import { HealthModule } from './health/health.module.js';
import createLoggerConfig from './init/pino.js';
import { LocaleInterceptor } from './locale/locale.interceptor.js';
import { LocaleModule } from './locale/locale.module.js';
import { MailModule } from './mail/mail.module.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { HeadersService } from './response/headers.service.js';
import { ResponseInterceptor } from './response/response.interceptor.js';

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
    HealthModule,
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
    {
      provide: APP_PIPE,
      useClass: StandardSchemaValidationPipe,
    },
  ],
})
export class AppModule {}
