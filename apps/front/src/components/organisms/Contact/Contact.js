/**
 * Contact
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import { api } from '../../../api/index';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';
import { ProtectedText } from 'react-protected-text';
import './Contact.scss';

/**
 * Contact Component
 * @param {object} props
 */
export class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.recaptchaRef = React.createRef();

    this.state = {
      verified: false,
      pending: false,
      recaptchaResponse: '',
      email: '',
      subject: '',
      message: '',
    };
  }

  /*** CAPTCHA */
  onVerify = (recaptchaResponse) => {
    this.setState({
      verified: true,
      recaptchaResponse: recaptchaResponse,
    });
  };

  onExpired = () => {
    this.clearCaptcha(false);
  };

  clearCaptcha = (reset) => {
    this.setState({
      verified: false,
      recaptchaResponse: '',
    });
    if (reset) {
      this.recaptchaRef.current.reset();
    }
  };

  /*** CONTROLLED FORM */
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      pending: true,
    });

    api
      .post('post_email', {
        reCaptchaResponse: this.state.recaptchaResponse,
        from: this.state.email,
        object: this.state.subject,
        message: this.state.message,
        _locale: i18n.language,
      })
      .then((res) => {
        this.clearCaptcha(true);
        toast.success(i18n.t('contact.mail_sent'), {
          position: toast.POSITION.TOP_CENTER,
        });
        this.setState({
          pending: false,
        });
      })
      .catch((error) => {
        this.clearCaptcha(true);
        this.setState({
          pending: false,
        });
      });
  };

  render() {
    const { t } = this.props;
    const submitDisabled = !this.state.verified || this.state.pending;

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
            <form id="contactForm" name="contactForm" onSubmit={this.onSubmit}>
              <fieldset>
                <div>
                  <label htmlFor="contactEmail">
                    {t('contact.message.email')} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    size="35"
                    id="contactEmail"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="contactSubject">{t('contact.message.subject')}</label>
                  <input
                    type="text"
                    size="35"
                    id="contactSubject"
                    name="subject"
                    value={this.state.subject}
                    onChange={this.handleInputChange}
                  />
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
                    required
                    value={this.state.message}
                    onChange={this.handleInputChange}
                  ></textarea>
                </div>

                <div className="submit cf">
                  <ReCAPTCHA
                    className="captcha"
                    hl={i18n.language}
                    ref={this.recaptchaRef}
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange={this.onVerify}
                    onExpired={this.onExpired}
                    theme="dark"
                    size="compact"
                  />
                  <div className="btn-submit-wrapper">
                    <button className="btn-submit" disabled={submitDisabled}>
                      {t('contact.message.submit')}
                      {this.state.pending && <i className="fas fa-spinner fa-spin fa-lg"></i>}
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
                <ProtectedText text={this.props.profileMain.fullName} />
                {this.props.profileMain.address.street && (
                  <>
                    <br />
                    <ProtectedText text={this.props.profileMain.address.street} />
                    <br />
                    <ProtectedText
                      text={`${this.props.profileMain.address.zip} ${this.props.profileMain.address.city}`}
                    />
                    <br />
                    <ProtectedText text={this.props.profileMain.address.country} />
                  </>
                )}
                <br />
                <ProtectedText text={this.props.profileMain.email} href={`mailto:${this.props.profileMain.email}`} />
                {this.props.profileMain.phone && (
                  <>
                    <br />
                    <ProtectedText
                      text={this.props.profileMain.phone}
                      href={`sms:${this.props.profileMain.phone.replace(/\s/g, '')}`}
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
}

export default withTranslation()(Contact);

Contact.propTypes = {
  profileMain: PropTypes.object.isRequired,
};
