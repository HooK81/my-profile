import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * ReCaptcha Hook
 */
const useReCaptchaToken = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  return async (action) => {
    if (!executeRecaptcha) {
      console.error('Execute recaptcha not yet available');
      return null;
    }
    try {
      console.log('Request for a new reCaptcha Token');
      return await executeRecaptcha(action);
    } catch (e) {
      return null;
    }
  };
};

export { useReCaptchaToken };
