import { DeviceHashGenerator } from './DeviceHashGenerator';

describe('DeviceHashGenerator', () => {
  it('should generate a 64-char hex string', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'TestAgent/1.0',
      configurable: true,
    });
    const hash = await new DeviceHashGenerator().generateHash();
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it('should return the same hash for the same user-agent', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'TestAgent/1.0',
      configurable: true,
    });
    const hash1 = await new DeviceHashGenerator().generateHash();
    const hash2 = await new DeviceHashGenerator().generateHash();
    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different user-agents', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'AgentA',
      configurable: true,
    });
    const hash1 = await new DeviceHashGenerator().generateHash();

    Object.defineProperty(navigator, 'userAgent', {
      value: 'AgentB',
      configurable: true,
    });
    const hash2 = await new DeviceHashGenerator().generateHash();
    expect(hash1).not.toBe(hash2);
  });
});
