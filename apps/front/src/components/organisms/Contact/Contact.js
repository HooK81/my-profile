/**
 * Contact
 */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useReCaptchaToken } from '../../../utils/reCaptcha';
import { selectAppLocale } from '../../../redux/app/selectors';
import { api } from '../../../api/index';
import { toast } from 'react-toastify';
import { VCardButton } from '../../atoms/VCardButton/VCardButton';
import i18n from 'i18next';
import { ProtectedText } from 'react-protected-text';
import './Contact.scss';
const RECAPTCHA_ACTION = 'sendContactMail';

/**
 * Contact Component
 * @param {object} props
 */
export function Contact(props) {
  const [pending, setPending] = useState(false);
  const [backErrors, setBackErrors] = useState({});
  const appLocale = useSelector((state) => selectAppLocale(state));
  const getReCaptchaToken = useReCaptchaToken();

  /*** FORM */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    setPending(true);
    setBackErrors({});
    try {
      await api.post(
        'post_email',
        {
          reCaptchaAction: RECAPTCHA_ACTION,
          reCaptchaToken: await getReCaptchaToken(RECAPTCHA_ACTION),
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
      );
      toast.success(i18n.t('contact.form.submitted'));
      setPending(false);
    } catch (error) {
      setPending(false);

      if (error instanceof Error && error.httpStatus === 400) {
        // Form validation error
        setBackErrors(
          api.buildFormErrors(error.data?.errors, { from: 'email' }),
        );
        return;
      }

      toast.error(`${error.message}\n${i18n.t('api.error.please_try_later')}`);
    }
  };

  const formErrors =
    Object.entries(backErrors).length > 0 ? backErrors : errors;

  const submitDisabled = pending;
  const { t } = useTranslation();

  return (
    <section id="contact" title="contact">
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
          <form
            id="contactForm"
            name="contactForm"
            title="contact-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset>
              <div>
                <label htmlFor="contactEmail">
                  {t('contact.message.email')}{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  size="35"
                  id="contactEmail"
                  name="email"
                  {...register('email', {
                    required: t('contact.form.required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('contact.form.invalid_email'),
                    },
                  })}
                />
                {formErrors.email && (
                  <span className="error" role="alert">
                    * {formErrors.email?.message}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="contactSubject">
                  {t('contact.message.subject')}
                </label>
                <input
                  type="text"
                  size="35"
                  id="contactSubject"
                  name="subject"
                  {...register('subject')}
                />
              </div>

              <div>
                <label htmlFor="contactMessage">
                  {t('contact.message.message')}{' '}
                  <span className="required">*</span>
                </label>
                <textarea
                  cols="50"
                  rows="8"
                  id="contactMessage"
                  name="message"
                  {...register('message', {
                    required: t('contact.form.required'),
                    minLength: {
                      value: 10,
                      message: t('contact.form.invalid_message'),
                    },
                  })}
                ></textarea>
                {formErrors.message && (
                  <span className="error" role="alert">
                    * {formErrors.message?.message}
                  </span>
                )}
                {formErrors.mail && (
                  <span className="error" role="alert">
                    * {formErrors.mail?.message}
                  </span>
                )}
              </div>
              <div className="submit cf">
                <div className="btn-submit-wrapper">
                  <button className="btn-submit" disabled={submitDisabled}>
                    {t('contact.message.submit')}
                    {pending && (
                      <i
                        className="fas fa-spinner fa-spin fa-lg"
                        title="spinner"
                      ></i>
                    )}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

        <aside className="four column footer-widgets">
          <div className="widget widget_contact">
            <h4 className="title">
              <VCardButton />
              {t('contact.address')}
            </h4>
            <p className="address">
              <ProtectedText text={props.profileMain.fullName} />
              {props.profileMain.address.street && (
                <>
                  <br />
                  <ProtectedText text={props.profileMain.address.street} />
                  <br />
                  <ProtectedText
                    text={`${props.profileMain.address.zip} ${props.profileMain.address.city}`}
                  />
                  <br />
                  <ProtectedText text={props.profileMain.address.country} />
                </>
              )}
              <br />
              <ProtectedText
                text={props.profileMain.email}
                href={`mailto:${props.profileMain.email}`}
              />
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
