import { cleanup, renderHook, waitFor } from '@testing-library/react';

vi.mock('zustand');
vi.mock('../api/Api');

import api from '../api/Api';
import { useAppStore } from '../stores/app.store';
import { createQueryWrapper } from '../test-utils';
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
    cleanup();
    vi.restoreAllMocks();
    vi.mocked(api.getFile).mockReset();
  });

  function renderFileUrl(file: string | undefined) {
    return renderHook(() => useProfileFileUrl(file), {
      wrapper: createQueryWrapper(),
    });
  }

  it('should return null when file is undefined', () => {
    const { result } = renderFileUrl(undefined);

    expect(result.current).toBeNull();
    expect(api.getFile).not.toHaveBeenCalled();
  });

  it('should fetch the file and return an object URL', async () => {
    useAppStore.setState({ locale: 'en' });

    const { result } = renderFileUrl('resume.pdf');

    await waitFor(() => {
      expect(result.current).toBe('blob:http://localhost/abc');
    });

    expect(api.getFile).toHaveBeenCalledWith('en', 'resume.pdf');
    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
  });

  it('should fetch the file again when the locale changes', async () => {
    useAppStore.setState({ locale: 'en' });

    const { result } = renderFileUrl('resume.pdf');
    await waitFor(() => expect(result.current).not.toBeNull());

    useAppStore.setState({ locale: 'fr' });

    await waitFor(() =>
      expect(api.getFile).toHaveBeenCalledWith('fr', 'resume.pdf'),
    );
  });

  it('should revoke the object URL on unmount', async () => {
    const { result, unmount } = renderFileUrl('resume.pdf');

    await waitFor(() => {
      expect(result.current).toBe('blob:http://localhost/abc');
    });

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost/abc',
    );
  });
});
