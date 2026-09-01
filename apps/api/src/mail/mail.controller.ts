import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmailValidation, emailValidationSchema } from 'my-profile-shared';

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
  async sendMail(
    @Body({ schema: emailValidationSchema }) payload: EmailValidation,
  ): Promise<void> {
    await this.mailService.sendEmailToTeam(payload);
  }
}
