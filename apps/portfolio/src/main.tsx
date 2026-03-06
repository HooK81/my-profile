import './styles/global.scss';
import './utils/i18n.ts';

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import App from './App.tsx';
import Loader from './components/ui/Loader/Loader';
import { printConsoleGreeting } from './utils/console-greeting';

printConsoleGreeting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader isLoaded={false} />}>
      <App />
    </Suspense>
    <ToastContainer position="bottom-center" />
  </StrictMode>,
);
