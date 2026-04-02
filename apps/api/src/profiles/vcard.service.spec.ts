import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { ProfileFactory } from 'my-profile-shared/fixtures';
import { LoggerModule } from 'nestjs-pino';
import VCard from 'vcard-creator';
import { Mock } from 'vitest';

import { streamToString } from '../../test_utils/stream-to-string';
import { ProfilesService } from './profiles.service';
import { VCardService } from './vcard.service';

vi.mock('vcard-creator');
vi.mock('fs/promises');

const profileFixtures = [
  ProfileFactory.build(),
  ProfileFactory.build({ user: { phone: undefined } }),
];

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

  it.each(profileFixtures)('should generate a vcard', async (profile) => {
    const expectedVCardData = 'vcard_data';

    (profilesService.loadProfile as Mock).mockResolvedValue(profile);
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

    const response = await service.getProfileVCard(profile.id);
    const responseData = await streamToString(response.getStream());

    expect(responseData).toBe(expectedVCardData);
  });

  it('should handle vcard error', async () => {
    (profilesService.loadProfile as Mock).mockResolvedValue(profileFixtures[0]);
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

    await expect(
      service.getProfileVCard(profileFixtures[0].id),
    ).rejects.toThrow('Unable to generate VCard');
  });
});
