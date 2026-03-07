import { z } from 'zod';

export const accessTokenSchema = z.object({
  accessToken: z.string(),
});

export type AccessToken = z.infer<typeof accessTokenSchema>;
