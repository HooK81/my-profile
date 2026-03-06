import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import { formatPhone } from '../../../utils/phone';
import Section from '../../layout/Section/Section';
import styles from './Contact.module.scss';
import ContactForm from './ContactForm';

function formatAddressLines(address: {
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
}): string[] {
  const cityLine = [address.zip, address.city].filter(Boolean).join(' ');

  return [address.street, cityLine, address.country].filter(
    (line): line is string => !!line,
  );
}

function Contact() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  if (!profile) {
    return null;
  }

  const { user } = profile;
  const addressLines = formatAddressLines(user.address);

  return (
    <Section id="contact" variant="primary" title={t('contact.title')}>
      <div className={styles.grid}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <i className="fa-solid fa-location-dot" />
            <div>
              <h4>{t('contact.location')}</h4>
              <p>
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {user.phone && (
            <div className={styles.infoItem}>
              <i className="fa-solid fa-mobile-screen" />
              <div>
                <h4>{t('contact.phone')}</h4>
                <p>
                  <a href={`tel:${user.phone}`}>{formatPhone(user.phone)}</a>
                </p>
              </div>
            </div>
          )}

          <div className={styles.infoItem}>
            <i className="fa-solid fa-envelope" />
            <div>
              <h4>{t('contact.email')}</h4>
              <p>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}

export default Contact;
