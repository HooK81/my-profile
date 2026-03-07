import { renderHook, waitFor } from '@testing-library/react';

vi.mock('zustand');
vi.mock('../api/Api');

import api from '../api/Api';
import { useAppStore } from '../stores/app.store';
import { useProfileFileUrl } from './useProfileFileUrl';

describe('useProfileFileUrl', () => {
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  const blob = new Blob(['test']);

  beforeEach(() => {
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/abc');
    vi.mocked(api.getFile).mockResolvedValue(blob);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(api.getFile).mockReset();
  });

  it('should return null when file is undefined', () => {
    const { result } = renderHook(() => useProfileFileUrl(undefined));

    expect(result.current).toBeNull();
    expect(api.getFile).not.toHaveBeenCalled();
  });

  it('should fetch file and return object URL', async () => {
    useAppStore.setState({ locale: 'en' });

    const { result } = renderHook(() => useProfileFileUrl('resume.pdf'));

    await waitFor(() => {
      expect(result.current).toBe('blob:http://localhost/abc');
    });

    expect(api.getFile).toHaveBeenCalledWith('en', 'resume.pdf');
    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
  });

  it('should revoke object URL on unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useProfileFileUrl('resume.pdf'),
    );

    await waitFor(() => {
      expect(result.current).toBe('blob:http://localhost/abc');
    });

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost/abc',
    );
  });

  it('should not revoke object URL when unmounted before load completes', () => {
    vi.mocked(api.getFile).mockReturnValue(new Promise(() => {}));

    const { unmount } = renderHook(() => useProfileFileUrl('resume.pdf'));

    unmount();

    expect(revokeObjectURLSpy).not.toHaveBeenCalled();
  });
});
