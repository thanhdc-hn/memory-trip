import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';

import { SettingsButton } from '@/components/settings/settings-button';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import router from './routes';

const App: FC = () => {
  return (
    <ThemeProvider>
      <main id="app">
        <RouterProvider router={router} />
        <SettingsButton />
        <Toaster />
      </main>
    </ThemeProvider>
  );
};

export default App;
