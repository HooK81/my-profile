import { CommandTestFactory } from 'nest-commander-testing';
import { AppModule } from 'src/app.module';

describe('Generate Device Hash Command (functionnal)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a device hash', async () => {
    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    }).compile();

    await CommandTestFactory.run(commandInstance, [
      'generate-device-hash',
      '--user-agent=Chrome',
    ]);

    await expect(
      CommandTestFactory.run(commandInstance, [
        'generate-device-hash',
        '--user-agent=Chrome',
      ]),
    ).resolves.not.toThrow();
  });

  it('should return an error without user-agent', async () => {
    const exitSpy = vi.spyOn(process, 'exit');

    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    }).compile();

    await CommandTestFactory.run(commandInstance, ['generate-device-hash']);

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
