/**
 * ReCaptcha Hook Mock
 */

const getReCaptchaToken = jest.fn()
const useReCaptchaToken = () => getReCaptchaToken;

export { useReCaptchaToken, getReCaptchaToken };
