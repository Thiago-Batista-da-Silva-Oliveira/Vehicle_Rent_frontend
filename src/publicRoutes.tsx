import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Login from './pages/Login';

const Landing = React.lazy(() => import('./pages/Landing'));

const Loading = () => <div>Loading...</div>;

const publicRoutesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Landing />
      </React.Suspense>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<Loading />}>
        <></>
      </React.Suspense>
    ),
  },
  {
    path: '/plans',
    element: (
      <React.Suspense fallback={<Loading />}>
       <></>
      </React.Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default publicRoutesConfig;