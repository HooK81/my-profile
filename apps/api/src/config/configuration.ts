import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';

type LogLevel = 'info' | 'debug' | 'warn' | 'error';

type SerializedCorsOrigin = {
  pattern: string;
  flags: string;
};

type JwtConfig = {
  secret: string;
};

export type Config = {
  node_env: string;
  app_env: string;
  app_version: string;
  port: number;
  cors_origin: boolean | RegExp[];
  log_level: LogLevel;
  jwt: JwtConfig;
  users_folder: string;
  mailer: {
    transport: TransportType;
    sender: string;
    team_address: string;
  };
};

const deserializeCorsOrigin = (value: string): RegExp[] => {
  const parsed = JSON.parse(value) as SerializedCorsOrigin[];
  return parsed.map(({ pattern, flags }) => new RegExp(pattern, flags));
};

const deserializeMailerTransport = (value: string): TransportType => {
  try {
    return JSON.parse(value) as TransportType;
  } catch {
    return value;
  }
};

export const configuration = (): Config => ({
  node_env: process.env.NODE_ENV || 'development',
  app_env: process.env.APP_ENV || 'development',
  app_version: (
    JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
    ) as { version: string }
  ).version,
  port: parseInt(process.env.PORT || '3000', 10),
  cors_origin: process.env.CORS_ORIGIN
    ? deserializeCorsOrigin(process.env.CORS_ORIGIN)
    : true,
  log_level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  users_folder: resolve(process.cwd(), process.env.USERS_FOLDER!),
  mailer: {
    transport: deserializeMailerTransport(process.env.MAILER_TRANSPORT!),
    sender: process.env.MAILER_SENDER!,
    team_address: process.env.MAILER_TEAM_ADDRESS!,
  },
});

export const envFilePath = [
  `.env.${process.env.NODE_ENV || 'development'}.local`,
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env',
];
