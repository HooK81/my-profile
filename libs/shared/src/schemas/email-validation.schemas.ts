import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MESSAGE_MIN_LENGTH = 10;

export const emailValidationSchema = z.object({
  from: z.email(),
  message: z.string().min(MESSAGE_MIN_LENGTH),
  subject: z.string().optional(),
});

export type EmailValidation = z.infer<typeof emailValidationSchema>;

export class EmailValidationDto extends createZodDto(emailValidationSchema) {}
