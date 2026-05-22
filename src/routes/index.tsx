import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@/components/error-boundary';
import withSuspense from '@/hoc/with-suspense';
import MainLayout from '@/layouts/main-layout';

const Home = withSuspense(lazy(() => import('@/views/home')));
const About = withSuspense(lazy(() => import('@/views/about')));
const AdminDashboard = withSuspense(
  lazy(() => import('@/views/admin/dashboard')),
);
const Join = withSuspense(lazy(() => import('@/views/join')));
const Timeline = withSuspense(lazy(() => import('@/views/timeline')));
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
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'join/:inviteCode',
        element: <Join />,
      },
      {
        path: 'timeline',
        element: <Timeline />,
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
