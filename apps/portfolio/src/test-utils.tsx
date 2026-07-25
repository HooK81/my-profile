import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { Profile } from 'my-profile-shared';
import type { ReactElement, ReactNode } from 'react';

import { DEFAULT_LOCALE, type Locale } from './constants';
import { profileQueryKey } from './hooks/useProfile';

type QueryOptions = {
  profile?: Profile;
  locale?: Locale;
};

export function createTestQueryClient({
  profile,
  locale = DEFAULT_LOCALE,
}: QueryOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  if (profile) {
    queryClient.setQueryData(profileQueryKey(locale), profile);
  }

  return queryClient;
}

export function createQueryWrapper(options: QueryOptions = {}) {
  const queryClient = createTestQueryClient(options);

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithQueryClient(
  ui: ReactElement,
  options: QueryOptions = {},
) {
  const queryClient = createTestQueryClient(options);

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    ),
  };
}
