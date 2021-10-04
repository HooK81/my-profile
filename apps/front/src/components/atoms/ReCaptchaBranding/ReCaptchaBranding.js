/**
 * ReCaptcha Branding
 * https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed
 */

import { Trans } from 'react-i18next';

import './ReCaptchaBranding.scss';

/**
 *  ReCaptcha Branding Component
 */
export const ReCaptchaBranding = () => {
  return (
    <small className="recaptcha-branding">
      <Trans i18nKey="recaptcha-branding.text">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>{' '}
        apply.
      </Trans>
    </small>
  );
};
