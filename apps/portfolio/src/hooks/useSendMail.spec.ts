import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

vi.mock('react-i18next');
vi.mock('react-toastify');
vi.mock('../api/Api');

import api from '../api/Api';
import { createQueryWrapper } from '../test-utils';
import { useSendMail } from './useSendMail';

const mockedApi = vi.mocked(api);

const payload = {
  from: 'test@example.com',
  subject: 'Test Subject',
  message: 'A valid test message for the form submission',
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('useSendMail', () => {
  function sendMail() {
    const { result } = renderHook(() => useSendMail(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.mutate(payload));

    return result;
  }

  describe('when the mail is sent', () => {
    beforeEach(() => {
      mockedApi.sendMail.mockResolvedValue(undefined);
    });

    it('should send the payload to the API', async () => {
      const result = sendMail();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedApi.sendMail).toHaveBeenCalledWith(payload);
    });

    it('should show a success toast', async () => {
      sendMail();

      await waitFor(() =>
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
          'contact.form.sendSuccess',
        ),
      );
    });
  });

  describe('when sending fails', () => {
    beforeEach(() => {
      mockedApi.sendMail.mockRejectedValue(new Error('network error'));
    });

    it('should expose the failure to the caller', async () => {
      const result = sendMail();

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('should show an error toast', async () => {
      sendMail();

      await waitFor(() =>
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          'contact.form.sendError error.tryAgainLater',
        ),
      );
    });
  });
});
