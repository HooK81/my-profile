import { CacheModule } from '@nestjs/cache-manager';
import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { configuration, envFilePath } from './config/configuration';
import validate from './config/env.validation';
import { HealthModule } from './health/health.module';
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
