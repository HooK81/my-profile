import { useTranslation } from 'react-i18next';

import api from '../../../api/Api';
import { useProfileFileUrl } from '../../../hooks/useProfileFileUrl';
import { useAppStore } from '../../../stores/app.store';
import { useProfileStore } from '../../../stores/profile.store';
import { formatPhone } from '../../../utils/phone';
import Section from '../../layout/Section/Section';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import SocialLinks from '../../ui/SocialLinks/SocialLinks';
import styles from './About.module.scss';

function About() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const locale = useAppStore((s) => s.locale);
  const profileImageUrl = useProfileFileUrl(profile?.user.image);

  if (!profile) {
    return null;
  }

  const { user } = profile;

  const downloadBlob = (blobUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadResume = async () => {
    const blob = await api.getFile(locale, user.resumePdf);
    downloadBlob(URL.createObjectURL(blob), user.resumePdf);
  };

  const handleDownloadVcard = async () => {
    const blob = await api.getVcard(locale);
    downloadBlob(URL.createObjectURL(blob), `${user.fullName}.vcf`);
  };

  return (
    <Section id="about" variant="primary" title={t('about.title')}>
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt={user.fullName}
              className={styles.photo}
            />
          )}
          {user.networks.length > 0 && (
            <SocialLinks networks={user.networks} size="sm" />
          )}
        </div>

        <div className={styles.infoCol}>
          <p className={styles.bio}>{user.bio}</p>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <strong>{t('about.name')}:</strong>
              <span>
                <a
                  href="#vcard"
                  onClick={(e) => {
                    e.preventDefault();
                    void handleDownloadVcard();
                  }}
                >
                  {user.fullName}
                </a>
              </span>
            </div>
            {user.address?.city && (
              <div className={styles.detailItem}>
                <strong>{t('about.location')}:</strong>
                <span>{user.address.city}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <strong>{t('about.email')}:</strong>
              <span>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </span>
            </div>
            {user.phone && (
              <div className={styles.detailItem}>
                <strong>{t('about.phone')}:</strong>
                <span>
                  <a href={`tel:${user.phone}`}>{formatPhone(user.phone)}</a>
                </span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button onClick={() => void handleDownloadResume()}>
              <Icon name="LuDownload" /> {t('about.downloadResume')}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default About;
