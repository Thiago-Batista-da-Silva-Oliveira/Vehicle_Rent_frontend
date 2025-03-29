import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import useAuthStore from './store/authStore';
import { DashboardRoutes } from './pages/dashboard/routes';

const Vehicles = React.lazy(() => import('./pages/vehicle/routes/index'));
const Calendar = React.lazy(() => import('./pages/calendar/routes/index'));
const Map = React.lazy(() => import('./pages/map/routes/index'));
const Settings = React.lazy(() => import('./pages/setting/routes/index'));
const Clients = React.lazy(() => import('./pages/customer/routes/index'));
const FineManagement = React.lazy(() => import('./pages/fineManagement/routes/index'));
const Collection = React.lazy(() => import('./pages/collection/routes/index'));


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
        element: <DashboardRoutes />,
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