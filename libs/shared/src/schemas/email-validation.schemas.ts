import { z } from 'zod';

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 5000;
export const SUBJECT_MAX_LENGTH = 255;

export const emailValidationSchema = z.object({
  from: z.email(),
  message: z.string().min(MESSAGE_MIN_LENGTH).max(MESSAGE_MAX_LENGTH),
  subject: z.string().max(SUBJECT_MAX_LENGTH).optional(),
});

export type EmailValidation = z.infer<typeof emailValidationSchema>;
