import './styles/global.scss';
import './utils/i18n.ts';

import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import App from './App.tsx';
import AppLoader from './components/ui/AppLoader/AppLoader';
import { queryClient } from './query/client';
import { printConsoleGreeting } from './utils/console-greeting';

printConsoleGreeting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<AppLoader isLoaded={false} />}>
        <App />
      </Suspense>
      <ToastContainer position="bottom-center" />
    </QueryClientProvider>
  </StrictMode>,
);
