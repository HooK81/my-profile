/**
 * Home Header
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { ScrollButton } from '../../atoms/ScrollButton/ScrollButton';
import { SocialLinks } from '../../molecules/SocialLinks/SocialLinks';
import { TextHighlighter } from '../../molecules/TextHighlighter/TextHighlighter';
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
          <h1 className="responsive-headline">{t('header.head_line', { name: props.profileMain.name })}</h1>
          <h3>
            <Trans i18nKey="header.description" base="base">
              I'm a <mark>{{ base: props.profileMain.base }}</mark> based{' '}
              <mark>{{ occupation: props.profileMain.occupation }}</mark>.
            </Trans>
            <br />
            <p>
              <TextHighlighter
                autoEscape={true}
                textToHighlight={props.profileMain.description}
              />
            </p>
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
