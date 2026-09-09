import { readFileSync } from 'fs';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { resolve } from 'path';

type LogLevel = 'info' | 'debug' | 'warn' | 'error';

type JwtConfig = {
  secret: string;
};

type DeviceFingerprintConfig = {
  secret: string;
};

export type Config = {
  node_env: string;
  app_env: string;
  app_version: string;
  port: number;
  public_app_url: string;
  public_origin: string;
  cookie_secure: boolean;
  log_level: LogLevel;
  jwt: JwtConfig;
  deviceFingerprint: DeviceFingerprintConfig;
  users_folder: string;
  mailer: {
    transport: SMTPTransport.Options | string;
    sender: string;
    team_address: string;
  };
};

const deserializeMailerTransport = (
  value: string,
): SMTPTransport.Options | string => {
  try {
    return JSON.parse(value) as SMTPTransport.Options | string;
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
  public_app_url: process.env.PUBLIC_APP_URL!,
  public_origin: new URL(process.env.PUBLIC_APP_URL!).origin,
  cookie_secure: process.env.COOKIE_SECURE === 'true',
  log_level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  deviceFingerprint: {
    secret: process.env.DEVICE_FINGERPRINT_SECRET!,
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
