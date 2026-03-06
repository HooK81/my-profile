import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../../../api/Api';
import Button from '../../ui/Button/Button';
import styles from './Contact.module.scss';

const MESSAGE_MIN_LENGTH = 10;

function ContactForm() {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    try {
      await api.sendMail({
        from,
        message,
        subject: subject || undefined,
      });
      toast.success(t('contact.form.sendSuccess'));
      setFrom('');
      setSubject('');
      setMessage('');
    } catch {
      toast.error(`${t('contact.form.sendError')} ${t('error.api.tryAgain')}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className={styles.form} action={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder={t('contact.form.emailPlaceholder')}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder={t('contact.form.subjectPlaceholder')}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          placeholder={t('contact.form.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={MESSAGE_MIN_LENGTH}
          rows={6}
          className={styles.textarea}
        />
      </div>
      <Button type="submit" className={styles.submitBtn} disabled={sending}>
        {sending ? t('contact.form.sending') : t('contact.form.sendButton')}
      </Button>
    </form>
  );
}

export default ContactForm;
