import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { LoggerModule } from 'nestjs-pino';
import ProfileFactory from 'test_utils/fixtures/profile';
import { streamToString } from 'test_utils/stream-to-string';
import VCard from 'vcard-creator';
import { Mock } from 'vitest';

import { ProfilesService } from './profiles.service';
import { VCardService } from './vcard.service';

vi.mock('vcard-creator');
vi.mock('fs/promises');

const profileFixture = ProfileFactory.build();

describe('VCardService', () => {
  let service: VCardService;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        VCardService,
        {
          provide: ProfilesService,
          useValue: {
            loadProfile: vi.fn(),
            getProfileFile: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VCardService>(VCardService);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a vcard', async () => {
    const expectedVCardData = 'vcard_data';

    (profilesService.loadProfile as Mock).mockResolvedValue(profileFixture);
    (profilesService.getProfileFile as Mock).mockResolvedValue({
      filePath: 'file/path',
      fileMime: 'image/jpeg',
    });
    (readFile as Mock).mockResolvedValue('rawjpeg' as string);

    (VCard as Mock).mockImplementation(function () {
      return {
        addName: vi.fn().mockReturnThis(),
        addEmail: vi.fn().mockReturnThis(),
        addPhoneNumber: vi.fn().mockReturnThis(),
        addURL: vi.fn().mockReturnThis(),
        addPhoto: vi.fn().mockReturnThis(),
        toString: vi.fn().mockReturnValue(expectedVCardData),
      };
    });

    const response = await service.getProfileVCard(profileFixture.id);
    const responseData = await streamToString(response.getStream());

    expect(responseData).toBe(expectedVCardData);
  });

  it('should handle vcard error', async () => {
    (profilesService.loadProfile as Mock).mockResolvedValue(profileFixture);
    (profilesService.getProfileFile as Mock).mockResolvedValue({
      filePath: 'file/path',
      fileMime: 'image/jpeg',
    });
    (readFile as Mock).mockResolvedValue('rawjpeg' as string);

    (VCard as Mock).mockImplementation(function () {
      return {
        addName: vi.fn().mockReturnThis(),
        addEmail: vi.fn().mockReturnThis(),
        addPhoneNumber: vi.fn().mockReturnThis(),
        addURL: vi.fn().mockReturnThis(),
        addPhoto: vi.fn().mockImplementation(() => {
          throw new Error('unable to read photo');
        }),
      };
    });

    await expect(service.getProfileVCard(profileFixture.id)).rejects.toThrow(
      'Unable to generate VCard',
    );
  });
});
