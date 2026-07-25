import { useAppStore } from '../stores/app.store';
import { useProfile } from './useProfile';

/**
 * True once everything the app needs before rendering its routes is available:
 * translations initialized and profile data loaded.
 */
export function useAppReady(): boolean {
  const i18nReady = useAppStore((s) => s.i18nReady);
  const { isSuccess } = useProfile();

  return i18nReady && isSuccess;
}
