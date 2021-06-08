/**
 * Home Header
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ScrollButton } from '../../atoms/ScrollButton/ScrollButton';
import { SocialLinks } from '../../molecules/SocialLinks/SocialLinks';
import ReactMarkdown from 'react-markdown';
import './HomeHeader.scss';

/**
 * Home Header Component
 * Used as a composition of Header Component

* @param {object} props
 */
export function HomeHeader(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="row banner">
        <div className="banner-text">
          <h1 className="responsive-headline">{t('header.head_line', { name: props.profileMain.firstName })}</h1>
          <h3>
            <ReactMarkdown>{t('header.description', {base: props.profileMain.base, occupation: props.profileMain.occupation})}</ReactMarkdown>
            <ReactMarkdown>{props.profileMain.description}</ReactMarkdown>
          </h3>
          <hr />
          <SocialLinks networks={props.profileMain.social} />
        </div>
      </div>
      <ScrollButton type={'down'} linkTo={'about'} />

    </>
  );
}

HomeHeader.defaultProps = {
  profileMain: {
    name: '',
    description: '',
    occupation: '',
    base: '',
    social: [],
  }
}
HomeHeader.propTypes = {
  profileMain: PropTypes.object.isRequired,
};
