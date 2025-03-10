import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import useAuthStore from './store/authStore';

const Users = React.lazy(() => import('./pages/master/Users'));
const AdminDashboard = React.lazy(() => import('./pages/master/MasterDashboard'));

const Loading = () => <div>Loading...</div>;
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/landing" />;
  }

  return <>{children}</>;
};

const adminProtectedRoutesConfig: RouteObject[] = [
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
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: (
          <React.Suspense fallback={<Loading />}>
            <Users />
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

export default adminProtectedRoutesConfig;