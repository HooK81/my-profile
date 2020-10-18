/**
 * Password Encoder Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import { PasswordEncoder } from '../passwordEncoder';

describe('Api Password Encoder', () => {
  let encoder = null;
  beforeEach(() => {
    process.env.REACT_APP_JWT_USER_UUID = '4eb7ab3f-9c7a-4954-9d87-b5631c755a46';
    encoder = new PasswordEncoder();
  });

  it('Should encodePassword without error', () => {
    expect(encoder.encodePassword('raw', 'salt')).toBe('48004d9a0c0d7bc961bbfec8175734ae6159067a9a32f95ac32861a2f305900b');
  });

  it('Should encodePassword without error', () => {
    expect(encoder.encodePassword('raw')).toBe('956abcf5e650b3523dc3de44c3e29c99e383dedac1fa34387d11997c5f2cd697');
  });

  it('Should generateKey without error', () => {
    expect(encoder.generateKey('raw', 'salt')).toBe('7873dcea-a533-5d87-83f2-c66419151ed0');
  });
});
