/**
 * VCard Button
 */

import React, { useEffect, useState } from 'react';
import { api } from '../../../api/index';
import { useTranslation } from 'react-i18next';

import './VCardButton.scss';

/**
 * VCard Button Component
 * @param object props
 */
export function VCardButton(props) {
  const [vCardUrl, setVCardUrl] = useState(null);

  // Get VCard URL
  useEffect(() => {
    const url = api.buildUrl(
      'get_user_vcard',
      {
        id: process.env.REACT_APP_PROFILE_ID,
        disposition: 'attachment',
      },
      true,
    );
    setVCardUrl(url);
  }, []);

  const { t } = useTranslation();

  return (
    <a className={`${props.className} vcard`} href={vCardUrl}>
      <i
        className="far fa-address-card fa-lg"
        title={t('about.download_vcf')}
      ></i>
    </a>
  );
}

VCardButton.defaultProps = {
  className: '',
};
