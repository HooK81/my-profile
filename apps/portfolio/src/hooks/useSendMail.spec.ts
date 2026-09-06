import { act, cleanup, renderHook, waitFor } from '@testing-library/react';

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

  it('should send the payload to the API', async () => {
    mockedApi.sendMail.mockResolvedValue(undefined);

    const result = sendMail();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.sendMail).toHaveBeenCalledWith(payload);
  });

  it('should expose the failure to the caller', async () => {
    mockedApi.sendMail.mockRejectedValue(new Error('network error'));

    const result = sendMail();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
