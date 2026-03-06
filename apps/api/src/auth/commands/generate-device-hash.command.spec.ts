import { CommandTestFactory } from 'nest-commander-testing';
import { AppModule } from 'src/app.module';

describe('Generate Device Hash Command (functionnal)', () => {
  const consoleSpy = vi.spyOn(console, 'log');

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

    expect(consoleSpy).toHaveBeenCalledWith(
      '✅ Device Hash: c4ef2ec214f90032f39dddfbfe51add7ef2c79da14fb2ccf14cb4c9ad15e5c9a',
    );
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
