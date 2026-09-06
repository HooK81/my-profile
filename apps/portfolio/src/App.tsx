import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/layout/Layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop/ScrollToTop';
import AppError from './components/ui/AppError/AppError';
import AppLoader from './components/ui/AppLoader/AppLoader';
import Spinner from './components/ui/Spinner/Spinner';
import { useAppReady } from './hooks/useAppReady';
import { useProfile } from './hooks/useProfile';
import { useThemeSync } from './hooks/useThemeSync';
import Home from './pages/Home/Home';
import { applyFavicon } from './utils/favicon';
import { getInitials } from './utils/initials';

const AboutThisSite = lazy(() => import('./pages/AboutThisSite/AboutThisSite'));

function App() {
  const { data: profile, isError, refetch } = useProfile();
  const isReady = useAppReady();
  useThemeSync();

  useEffect(() => {
    if (profile) {
      document.title = `${profile.user.fullName} - ${profile.user.occupation}`;
      applyFavicon(getInitials(profile.user.fullName));
    }
  }, [profile]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {isError ? (
        <AppError onRetry={() => void refetch()} />
      ) : (
        <AppLoader isLoaded={isReady} />
      )}
      {isReady && (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="about-this-site"
              element={
                <Suspense fallback={<Spinner />}>
                  <AboutThisSite />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
