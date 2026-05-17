import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

import router from './routes';

const App: React.FC = () => {
  return (
    <main id="app">
      <RouterProvider router={router}/>
      <Toaster/>
    </main>
  );
};

export default App;
