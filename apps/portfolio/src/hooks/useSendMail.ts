import { useMutation } from '@tanstack/react-query';
import type { EmailValidation } from 'my-profile-shared';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../api/Api';

export function useSendMail() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: EmailValidation) => api.sendMail(payload),
    onSuccess: () => {
      toast.success(t('contact.form.sendSuccess'));
    },
    onError: () => {
      toast.error(`${t('contact.form.sendError')} ${t('error.tryAgainLater')}`);
    },
  });
}
