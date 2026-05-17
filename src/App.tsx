import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import router from './routes';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <main id="app">
        <RouterProvider router={router}/>
        <Toaster/>
      </main>
    </ThemeProvider>
  );
};

export default App;
