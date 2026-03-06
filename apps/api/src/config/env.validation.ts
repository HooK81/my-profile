import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_ENV: z.enum(['local', 'development', 'production']).default('local'),

  PORT: z.coerce.number().min(1).max(65535).optional().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CORS_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string(),
  USERS_FOLDER: z.string(),
  MAILER_TRANSPORT: z.string(),
  MAILER_SENDER: z.string(),
  MAILER_TEAM_ADDRESS: z.string().email(),
});

export default (config: Record<string, unknown>): Record<string, unknown> => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  return result.data;
};
