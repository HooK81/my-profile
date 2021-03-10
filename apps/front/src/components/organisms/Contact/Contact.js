/**
 * Contact
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectAppLocale } from '../../../redux/app/selectors';
import ReCAPTCHA from 'react-google-recaptcha';
import { api, ApiError } from '../../../api/index';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { ProtectedText } from 'react-protected-text';
import './Contact.scss';

/**
 * Contact Component
 * @param {object} props
 */
export function Contact(props) {
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  const [recaptchaResponse, setRecaptchaResponse] = useState('');
  const recaptchaRef = useRef();
  const appLocale = useSelector((state) => selectAppLocale(state));

  /*** CAPTCHA */
  const onVerify = (recaptchaResponse) => {
    setVerified(true);
    setRecaptchaResponse(recaptchaResponse);
  };
  const clearCaptcha = (reset) => {
    setVerified(false);
    setRecaptchaResponse('');
    if (reset) {
      recaptchaRef.current.reset();
    }
  };
  const onExpired = () => clearCaptcha(false);

  /*** FORM */
  let { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    setPending(true);
    setBackErrors({});

    api
      .post(
        'post_email',
        {
          reCaptchaResponse: recaptchaResponse,
          from: data?.email,
          subject: data?.subject,
          message: data?.message,
        },
        {
          _locale: appLocale,
        },
        {
          showError: false,
        },
      )
      .then((res) => {
        clearCaptcha(true);
        toast.success(i18n.t('contact.form.submitted'), {
          position: toast.POSITION.TOP_CENTER,
        });
        setPending(false);
      })
      .catch((error) => {
        setPending(false);

        if (error instanceof Error && typeof error.httpStatus === 'number' && error.httpStatus === 400) {
          // Form validation error
          setBackErrors(api.buildFormErrors(error.data?.errors, { from: 'email' }));
          return;
        }

        toast.error(`${error.message}\n${i18n.t('api.error.please_try_later')}`, {
          position: toast.POSITION.TOP_CENTER,
        });
        clearCaptcha(true);
      });
  };

  if (Object.entries(backErrors).length > 0) {
    errors = backErrors;
  }

  const submitDisabled = !verified || pending;
  const { t } = useTranslation();

  return (
    <section id="contact">
      <div className="row section-head">
        <div className="two column header-col">
          <h1>
            <span>{t('contact.title')}</span>
          </h1>
        </div>

        <div className="ten column">
          <p className="lead">{t('contact.description')}</p>
        </div>
      </div>

      <div className="row">
        <div className="eight column">
          <form id="contactForm" name="contactForm" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div>
                <label htmlFor="contactEmail">
                  {t('contact.message.email')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  size="35"
                  id="contactEmail"
                  name="email"
                  ref={register({
                    required: t('contact.form.required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('contact.form.invalid_email'),
                    },
                  })}
                />
                {errors.email && <span className="error">* {errors.email?.message}</span>}
              </div>

              <div>
                <label htmlFor="contactSubject">{t('contact.message.subject')}</label>
                <input type="text" size="35" id="contactSubject" name="subject" ref={register} />
              </div>

              <div>
                <label htmlFor="contactMessage">
                  {t('contact.message.message')} <span className="required">*</span>
                </label>
                <textarea
                  cols="50"
                  rows="8"
                  id="contactMessage"
                  name="message"
                  ref={register({
                    required: t('contact.form.required'),
                    minLength: {
                      value: 10,
                      message: t('contact.form.invalid_message'),
                    },
                  })}
                ></textarea>
                {errors.message && <span className="error">* {errors.message?.message}</span>}
              </div>

              <div className="submit cf">
                <ReCAPTCHA
                  className="captcha"
                  hl={appLocale}
                  ref={recaptchaRef}
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={onVerify}
                  onExpired={onExpired}
                  theme="dark"
                  size="compact"
                />
                <div className="btn-submit-wrapper">
                  <button className="btn-submit" disabled={submitDisabled}>
                    {t('contact.message.submit')}
                    {pending && <i className="fas fa-spinner fa-spin fa-lg"></i>}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

        <aside className="four column footer-widgets">
          <div className="widget widget_contact">
            <h4>{t('contact.address')}</h4>
            <p className="address">
              <ProtectedText text={props.profileMain.fullName} />
              {props.profileMain.address.street && (
                <>
                  <br />
                  <ProtectedText text={props.profileMain.address.street} />
                  <br />
                  <ProtectedText text={`${props.profileMain.address.zip} ${props.profileMain.address.city}`} />
                  <br />
                  <ProtectedText text={props.profileMain.address.country} />
                </>
              )}
              <br />
              <ProtectedText text={props.profileMain.email} href={`mailto:${props.profileMain.email}`} />
              {props.profileMain.phone && (
                <>
                  <br />
                  <ProtectedText
                    text={props.profileMain.phone}
                    href={`sms:${props.profileMain.phone.replace(/\s/g, '')}`}
                  />
                </>
              )}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

Contact.propTypes = {
  profileMain: PropTypes.object.isRequired,
};
