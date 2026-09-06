import { useMutation } from '@tanstack/react-query';
import type { EmailValidation } from 'my-profile-shared';

import api from '../api/Api';

export function useSendMail() {
  return useMutation({
    mutationFn: (payload: EmailValidation) => api.sendMail(payload),
  });
}
