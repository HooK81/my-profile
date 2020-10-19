/**
 * About
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../../api/index';
import { ProfilePicture } from '../../atoms/ProfilePicture/ProfilePicture';
import { ProtectedText } from '../../atoms/ProtectedText/ProtectedText';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import './About.scss';

/**
 * About Component
 * @param {object} props
 */
export function About(props) {
  // Component State
  const [pictureUrl, setPictureUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  // Get profile picture URL
  useEffect(() => {
    const url = api.buildUrl(
      'get_user_file',
      {
        id: process.env.REACT_APP_PROFILE_ID,
        file: props.profileMain.image,
      },
      true,
    );
    setPictureUrl(url);
  }, [props.profileMain.image]);

  // Get resume pdf URL
  const lng = i18n.language;
  useEffect(() => {
    const url = api.buildUrl(
      'get_user_file',
      {
        id: process.env.REACT_APP_PROFILE_ID,
        file: props.profileMain.resumePdf,
        _locale: lng,
        disposition: 'attachment',
      },
      true,
      true,
    );
    setResumeUrl(url);
  }, [props.profileMain.resumePdf, lng]);

  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="row">
        <div className="three column">
          <ProfilePicture name={props.profileMain.name} url={pictureUrl} />
        </div>
        <div className="nine column main-col">
          <h2>{t('about.title')}</h2>
          <div className="bio">
            <p>{props.profileMain.bio}</p>
          </div>
          <div className="row">
            <div className="column contact-details">
              <h2>{t('about.contact_details')}</h2>
              <p className="address">
                <span>{props.profileMain.fullName}</span>
                <br />
                <ProtectedText text={props.profileMain.address.street} />
                <br />
                <ProtectedText
                  text={`${props.profileMain.address.zip} ${props.profileMain.address.city} ${props.profileMain.address.country}`}
                />
                <br />
                <span>
                  <a href={'mailto:' + props.profileMain.email}>{props.profileMain.email}</a>
                </span>
                <br />
                <ProtectedText text={props.profileMain.phone} />
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
