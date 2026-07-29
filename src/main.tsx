import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerSW } from 'virtual:pwa-register';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './i18n';
import './style.css';

// Register Service Worker and make sure updates are picked up as soon as
// the app is opened, instead of waiting for the browser's own (slow/lazy)
// update check.
const UPDATE_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

// `registerType: 'autoUpdate'` already makes the service worker activate a
// new version and reload the page automatically as soon as it is found -
// there is no update prompt to accept. The missing piece is asking the
// browser to actually look for a new version at the right time, since it
// otherwise only checks lazily on its own schedule.
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;

    const checkForUpdate = async () => {
      if (registration.installing || !navigator.onLine) return;

      try {
        // Bypass HTTP cache so we always see the latest deployed
        // service worker, not a stale cached copy of it.
        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: { 'cache-control': 'no-cache' },
        });
        if (resp.status === 200) await registration.update();
      } catch {
        // Network unavailable, ignore and try again next time.
      }
    };

    // Check right away, whenever the app regains focus/visibility (i.e. the
    // user reopens the PWA), and periodically while it stays open.
    void checkForUpdate();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void checkForUpdate();
    });
    window.addEventListener('focus', () => void checkForUpdate());
    setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
