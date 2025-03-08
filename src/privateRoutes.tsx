import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import useAuthStore from './store/authStore';

const Vehicles = React.lazy(() => import('./pages/Vehicles'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Map = React.lazy(() => import('./pages/Map'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Clients = React.lazy(() => import('./pages/Clients'));
const FineManagement = React.lazy(() => import('./pages/FineManagement'));
const Collection = React.lazy(() => import('./pages/Collection'));


const Loading = () => <div>Loading...</div>;
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/landing" />;
  }

  return <>{children}</>;
};

const protectedRoutesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'vehicles',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Vehicles />
          </React.Suspense>
        ),
      },
      {
        path: 'clients',
        element: (
          <React.Suspense fallback={<Loading />}>
           <Clients />
          </React.Suspense>
        ),
      },
      {
        path: 'fine_management',
        element: (
          <React.Suspense fallback={<Loading />}>
           <FineManagement  />
          </React.Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Calendar />
          </React.Suspense>
        ),
      },
      {
        path: 'collection',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Collection />
          </React.Suspense>
        ),
      },
      {
        path: 'map',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Map />
          </React.Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Settings />
          </React.Suspense>
        ),
      },
        {
          path: '*',
          element: <Navigate to="/" />,
        },
    ],
  },
];

export default protectedRoutesConfig;