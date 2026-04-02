import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EmailValidation, emailValidationSchema } from 'my-profile-shared';
import { ZodValidationPipe } from 'nestjs-zod';

import { JwtAuthGuard } from '../auth/auth.guard';
import { MailService } from './mail.service';

@Controller({
  path: 'mails',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(emailValidationSchema))
  async sendMail(@Body() payload: EmailValidation): Promise<void> {
    await this.mailService.sendEmailToTeam(payload);
  }
}
