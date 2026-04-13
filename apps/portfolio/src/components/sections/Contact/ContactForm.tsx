import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  SUBJECT_MAX_LENGTH,
} from 'my-profile-shared';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../../../api/Api';
import Button from '../../ui/Button/Button';
import styles from './Contact.module.scss';

type FormState = {
  from: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  from: '',
  subject: '',
  message: '',
};

function SubmitButton() {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? t('contact.form.sending') : t('contact.form.sendButton')}
    </Button>
  );
}

function ContactForm() {
  const { t } = useTranslation();
  const [messageLength, setMessageLength] = useState(0);

  const submitAction = async (
    _: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const from = formData.get('from') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      await api.sendMail({
        from,
        message,
        subject: subject || undefined,
      });
      toast.success(t('contact.form.sendSuccess'));
      setMessageLength(0);

      return initialState;
    } catch {
      toast.error(`${t('contact.form.sendError')} ${t('error.api.tryAgain')}`);
      return { from, subject, message };
    }
  };

  const [state, formAction] = useActionState(submitAction, initialState);

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.formGroup}>
        <input
          type="email"
          name="from"
          placeholder={t('contact.form.emailPlaceholder')}
          defaultValue={state.from}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="subject"
          placeholder={t('contact.form.subjectPlaceholder')}
          defaultValue={state.subject}
          maxLength={SUBJECT_MAX_LENGTH}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="message"
          placeholder={t('contact.form.messagePlaceholder')}
          defaultValue={state.message}
          onChange={(e) => setMessageLength(e.target.value.length)}
          required
          minLength={MESSAGE_MIN_LENGTH}
          maxLength={MESSAGE_MAX_LENGTH}
          rows={6}
          className={styles.textarea}
        />
        {messageLength > 0 && (
          <span
            className={`${styles.charCounter} ${messageLength >= MESSAGE_MAX_LENGTH * 0.9 ? styles.charCounterWarning : ''}`}
          >
            {messageLength} / {MESSAGE_MAX_LENGTH}
          </span>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}

export default ContactForm;
