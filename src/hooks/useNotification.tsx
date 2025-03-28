import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  AlertProps,
  SnackbarProps,
  AlertColor,
} from '@mui/material';

interface NotificationContextProps {
  showNotification: (message: string, type?: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  closeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(4000);

  const closeNotification = useCallback(() => {
    setOpen(false);
  }, []);

  const showNotification = useCallback((message: string, type: AlertColor = 'info', duration = 4000) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((message: string, duration = 4000) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message: string, duration = 4000) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration = 4000) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration = 4000) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeNotification}
          severity={type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

export default useNotification; 