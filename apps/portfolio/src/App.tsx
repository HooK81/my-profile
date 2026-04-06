import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import api from './api/Api';
import Layout from './components/layout/Layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop/ScrollToTop';
import AppLoader from './components/ui/AppLoader/AppLoader';
import Spinner from './components/ui/Spinner/Spinner';
import Home from './pages/Home/Home';
import { useAppStore } from './stores/app.store';
import { useProfileStore } from './stores/profile.store';

const AboutThisSite = lazy(() => import('./pages/AboutThisSite/AboutThisSite'));

function App() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const i18nReady = useAppStore((s) => s.i18nReady);
  const locale = useAppStore((s) => s.locale);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const setIsLoaded = useAppStore((s) => s.setIsLoaded);

  useEffect(() => {
    if (!i18nReady) {
      return;
    }

    const init = async () => {
      setIsLoaded(false);
      try {
        await api.ensureAuth();

        const profile = await api.loadProfile(locale);
        updateProfile(profile);

        document.title = `${profile.user.fullName} - ${profile.user.occupation}`;
      } catch (error) {
        console.error('Failed to init app', error);
        setIsLoaded(false);
      }
    };

    void init();
  }, [i18nReady, locale, updateProfile, setIsLoaded]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLoader isLoaded={isLoaded} />
      {isLoaded && (
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
