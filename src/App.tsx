import React from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './routes';

const App: React.FC = () => {
  return (
    <main id="app">
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
