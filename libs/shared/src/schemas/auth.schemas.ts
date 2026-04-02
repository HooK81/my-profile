import { z } from 'zod';

export const accessTokenSchema = z.object({
  accessToken: z.string(),
});

export type AccessToken = z.infer<typeof accessTokenSchema>;

export const authResponseSchema = z.object({
  authenticated: z.boolean(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
