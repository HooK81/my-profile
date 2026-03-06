import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { EmailValidationDto } from 'my-profile-shared';
import { Logger } from 'nestjs-pino';

const EMAIL_SUBJECT_PREFIX = '[My Profile]';
const EMAIL_SUBJECT_DEFAULT = 'Contact message';

@Injectable()
export class MailService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendEmailToTeam(payload: EmailValidationDto): Promise<void> {
    if (!(await this.mailerService.verifyAllTransporters())) {
      throw new InternalServerErrorException('Email transport error');
    }

    const mailData = this.buildMailData(payload);

    // fire and forget promise
    this.mailerService.sendMail(mailData).catch((error) => {
      this.logger.error('Mailer service error', {
        error: (error as Error).message,
      });
    });
  }

  private buildMailData(payload: EmailValidationDto): ISendMailOptions {
    return {
      to: this.configService.get<string>('mailer.team_address'),
      from: this.configService.get<string>('mailer.sender'),
      subject: `${EMAIL_SUBJECT_PREFIX} - ${payload.subject ?? EMAIL_SUBJECT_DEFAULT}`,
      template: 'teamMail',
      context: payload,
    };
  }
}
