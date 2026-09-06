import { useTranslation } from 'react-i18next';

import api from '../../../api/Api';
import { useProfile } from '../../../hooks/useProfile';
import { useProfileFileUrl } from '../../../hooks/useProfileFileUrl';
import { useAppStore } from '../../../stores/app.store';
import { formatPhone } from '../../../utils/phone';
import Section from '../../layout/Section/Section';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import SocialLinks from '../../ui/SocialLinks/SocialLinks';
import styles from './About.module.scss';

function About() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
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
    <Section id="about" variant="secondary" index="01" title={t('about.title')}>
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          <div className={styles.glowBackdrop} aria-hidden="true" />
          <div className={styles.photoCard}>
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt={user.fullName}
                className={styles.photo}
              />
            )}
            {user.networks.length > 0 && (
              <div className={styles.socials}>
                <SocialLinks networks={user.networks} size="md" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoCol}>
          <p className={styles.bio}>{user.bio}</p>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t('about.name')}</span>
              <span className={styles.detailValue}>{user.fullName}</span>
            </div>
            {user.address?.city && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  {t('about.location')}
                </span>
                <span className={styles.detailValue}>{user.address.city}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t('about.email')}</span>
              <a className={styles.detailValue} href={`mailto:${user.email}`}>
                {user.email}
              </a>
            </div>
            {user.phone && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('about.phone')}</span>
                <a className={styles.detailValue} href={`tel:${user.phone}`}>
                  {formatPhone(user.phone)}
                </a>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={() => void handleDownloadResume()}
            >
              <Icon name="LuDownload" /> {t('about.downloadResume')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleDownloadVcard()}
            >
              <Icon name="LuContact" /> {t('about.downloadVcard')}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default About;
