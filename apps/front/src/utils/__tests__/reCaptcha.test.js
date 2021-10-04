/**
 * reCaptcha HooK Test Suite
 */
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useReCaptchaToken } from '../reCaptcha';

jest.mock('react-google-recaptcha-v3');
const executeRecaptchaMock = jest.fn();
const useGoogleReCaptchaMock = ({
  executeRecaptcha: executeRecaptchaMock,
});

describe('reCaptcha HooK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should hook return a token", async () => {
    executeRecaptchaMock.mockResolvedValue('token');
    useGoogleReCaptcha.mockReturnValue(useGoogleReCaptchaMock);

    const getReCaptchaToken = useReCaptchaToken();
    expect(await getReCaptchaToken()).toBe('token');
  });

  it("Should hook return null when an error occur", async () => {
    executeRecaptchaMock.mockRejectedValue('error');
    useGoogleReCaptcha.mockReturnValue(useGoogleReCaptchaMock);

    const getReCaptchaToken = useReCaptchaToken();
    expect(await getReCaptchaToken()).toBe(null);
  });

  it("Should hook return null when executeRecaptcha is not available", async () => {
    useGoogleReCaptcha.mockReturnValue({
      executeRecaptcha: null
    });

    const getReCaptchaToken = useReCaptchaToken();
    expect(await getReCaptchaToken()).toBe(null);
  });
});
