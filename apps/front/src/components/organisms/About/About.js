/**
 * About
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { api } from '../../../api/index';
import { selectAppLocale } from '../../../redux/app/selectors';

import { ProfilePicture } from '../../atoms/ProfilePicture/ProfilePicture';
import { VCardButton } from '../../atoms/VCardButton/VCardButton';
import { ProtectedText } from 'react-protected-text';
import { useTranslation } from 'react-i18next';
import './About.scss';

/**
 * About Component
 * @param {object} props
 */
export function About(props) {
  // Component State
  const [pictureUrl, setPictureUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const appLocale = useSelector((state) => selectAppLocale(state));

  // Get profile picture URL
  useEffect(() => {
    const url = api.buildUrl('get_user_file', {
      id: process.env.REACT_APP_PROFILE_ID,
      file: props.profileMain.image,
    });
    setPictureUrl(url);
  }, [props.profileMain.image]);

  // Get resume pdf URL
  useEffect(() => {
    const url = api.buildUrl(
      'get_user_file',
      {
        id: process.env.REACT_APP_PROFILE_ID,
        file: props.profileMain.resumePdf,
        _locale: appLocale,
        disposition: 'attachment',
      },
      true,
    );
    setResumeUrl(url);
  }, [props.profileMain.resumePdf, appLocale]);

  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="row">
        <div className="three column">
          <ProfilePicture name={props.profileMain.firstName} url={pictureUrl} />
        </div>
        <div className="nine column main-col">
          <h2>{t('about.title')}</h2>
          <div className="bio">
            <p>{props.profileMain.bio}</p>
          </div>
          <div className="row">
            <div className="column contact-details">
              <h2>
                <VCardButton />
                {t('about.contact_details')}
              </h2>
              <p className="address">
                <ProtectedText text={props.profileMain.fullName} />
                {props.profileMain.address.street && (
                  <>
                    <br />
                    <ProtectedText text={props.profileMain.address.street} />
                    <br />
                    <ProtectedText
                      text={`${props.profileMain.address.zip} ${props.profileMain.address.city} ${props.profileMain.address.country}`}
                    />
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
            <div className="column download">
              <p>
                <a href={resumeUrl} className="button">
                  <i className="fa fa-download"></i>
                  {t('about.download_resume')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

About.defaultProps = {
  profileMain: {
    name: '',
    fullName: '',
    image: '',
    address: {
      street: '',
      zip: '',
      city: '',
      country: '',
    },
    phone: '',
  },
};
About.propTypes = {
  profileMain: PropTypes.object.isRequired,
};
