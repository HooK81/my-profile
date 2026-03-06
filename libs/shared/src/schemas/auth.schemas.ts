import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const accessTokenSchema = z.object({
  accessToken: z.string(),
});

export type AccessToken = z.infer<typeof accessTokenSchema>;

export class AccessTokenDto extends createZodDto(accessTokenSchema) {}
