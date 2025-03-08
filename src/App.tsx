import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import publicRoutesConfig from './publicRoutes';
import privateRoutesConfig from './privateRoutes';
import { ThemeProvider } from './context/ThemeContext';
import useAuthStore from './store/authStore';

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Routes component using useRoutes hook
const Routes = () => {
  const {isAuthenticated} = useAuthStore();
  const routes = useRoutes(isAuthenticated ? privateRoutesConfig : publicRoutesConfig);
  return routes;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;