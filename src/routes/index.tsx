import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import withSuspense from '@/hoc/withSuspense';
import MainLayout from '@/layouts/MainLayout';

const Home = withSuspense(lazy(() => import('@/views/Home')));
const About = withSuspense(lazy(() => import('@/views/About')));
const NotFound = withSuspense(
  lazy(() => import('../views/not-found/not-found')),
);

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
