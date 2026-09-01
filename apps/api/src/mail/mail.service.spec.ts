import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerModule } from 'nestjs-pino';

import { MailService } from './mail.service.js';

describe('MailService', () => {
  let service: MailService;

  const verifyAllTransportersMock = vi.fn();
  const sendMailMock = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            verifyAllTransporters: verifyAllTransportersMock,
            sendMail: sendMailMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string): string => {
              const map: Record<string, string> = {
                'mailer.team_address': 'team@example.com',
                'mailer.sender': 'noreply@example.com',
              };
              return map[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', async () => {
    verifyAllTransportersMock.mockResolvedValue(true);
    sendMailMock.mockResolvedValue(null);

    await service.sendEmailToTeam({
      from: 'email',
      message: 'test message',
    });

    expect(sendMailMock).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        from: 'noreply@example.com',
        subject: '[My Profile] - Contact message',
        to: 'team@example.com',
        context: {
          from: 'email',
          message: 'test message',
        },
      }),
    );
  });

  it('should not reject the caller when the email fails to be sent', async () => {
    verifyAllTransportersMock.mockResolvedValue(true);
    sendMailMock.mockRejectedValue(new Error('Error sending mail'));

    await expect(
      service.sendEmailToTeam({
        from: 'email',
        message: 'test message',
      }),
    ).resolves.toBeUndefined();
  });

  it('should check transport configuration', async () => {
    verifyAllTransportersMock.mockResolvedValue(false);

    await expect(
      service.sendEmailToTeam({
        from: 'email',
        message: 'test message',
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
