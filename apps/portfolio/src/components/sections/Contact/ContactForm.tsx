import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  SUBJECT_MAX_LENGTH,
} from 'my-profile-shared';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { useSendMail } from '../../../hooks/useSendMail';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import styles from './Contact.module.scss';

type FormState = {
  from: string;
  subject: string;
  message: string;
};

type SendStatus = 'idle' | 'success' | 'error';

const MESSAGE_WARNING_THRESHOLD = Math.floor(MESSAGE_MAX_LENGTH * 0.9);

const initialState: FormState = {
  from: '',
  subject: '',
  message: '',
};

type FormFooterProps = {
  status: SendStatus;
  messageLength: number;
};

function FormFooter({ status, messageLength }: FormFooterProps) {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  const statusText = pending
    ? t('contact.form.sending')
    : status === 'success'
      ? t('contact.form.sendSuccess')
      : status === 'error'
        ? `${t('contact.form.sendError')} ${t('error.tryAgainLater')}`
        : null;

  const isLengthWarning =
    messageLength < MESSAGE_MIN_LENGTH ||
    messageLength >= MESSAGE_WARNING_THRESHOLD;

  return (
    <div className={styles.footerRow}>
      {statusText ? (
        <span className={styles.status} role="status">
          {statusText}
        </span>
      ) : (
        <span
          className={`${styles.charCounter} ${isLengthWarning ? styles.charCounterWarning : ''}`}
        >
          {messageLength > 0 && `${messageLength} / ${MESSAGE_MAX_LENGTH}`}
        </span>
      )}
      <Button
        type="submit"
        variant="primary"
        className={styles.submitBtn}
        isLoading={pending}
      >
        {t('contact.form.sendButton')}
        <Icon name="LuSend" />
      </Button>
    </div>
  );
}

function ContactForm() {
  const { t } = useTranslation();
  const [messageLength, setMessageLength] = useState(0);
  const [status, setStatus] = useState<SendStatus>('idle');

  const { mutateAsync: sendMail } = useSendMail();

  const submitAction = async (
    _: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const from = formData.get('from') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      await sendMail({
        from,
        message,
        subject: subject || undefined,
      });
      setMessageLength(0);
      setStatus('success');

      return initialState;
    } catch {
      setStatus('error');

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
          onChange={(e) => {
            setMessageLength(e.target.value.length);
            setStatus('idle');
          }}
          required
          minLength={MESSAGE_MIN_LENGTH}
          maxLength={MESSAGE_MAX_LENGTH}
          rows={6}
          className={styles.textarea}
        />
      </div>
      <FormFooter status={status} messageLength={messageLength} />
    </form>
  );
}

export default ContactForm;
