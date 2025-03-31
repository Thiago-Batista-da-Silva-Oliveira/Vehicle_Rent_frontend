import React, { useMemo } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography, 
  Divider,
  useTheme,
  alpha,
  ListItemButton
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as VehiclesIcon,
  People as ClientsIcon,
  EventNote as CalendarIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  Report as ReportIcon,
  Money as MoneyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavigation= useMemo<NavigationItem[]>(() => {
    if (user?.role === 'master') {
      return [
        { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
        { title: 'Users', path: '/users', icon: <ClientsIcon /> },
      ]
    }
    else {
      return [
        { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
        { title: 'Veículos', path: '/vehicles', icon: <VehiclesIcon /> },
        { title: 'Clientes', path: '/clients', icon: <ClientsIcon /> },
        { title: 'Usuários', path: '/users', icon: <PersonIcon /> },
        { title: 'Calendário', path: '/calendar', icon: <CalendarIcon /> },
        { title: 'Gestão de Multas', path: '/fine_management', icon: <ReportIcon /> },
        { title: 'Mapa', path: '/map', icon: <MapIcon /> },
        { title: 'Coleta', path: '/collection', icon: <MoneyIcon /> },
      ]
    }
  }, [user?.role]);
  
  
  const supportNavigation: NavigationItem[] = [
    { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };
  
  const renderNavItems = (items: NavigationItem[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      
      return (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              '&:hover': {
                bgcolor: isActive 
                  ? alpha(theme.palette.primary.main, 0.15) 
                  : alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      );
    });
  };
  
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            mr: 2,
          }}
        >
          <VehiclesIcon />
        </Box>
        <Box>
          <Typography variant="h6" color="textPrimary" fontWeight="bold">
            Rent
          </Typography>
          <Typography variant="caption" color="textSecondary">
            v1.0.0
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
        <Box mb={2}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ px: 3, mb: 1, display: 'block' }}
          >
            Navigation
          </Typography>
          <List disablePadding>{renderNavItems(mainNavigation)}</List>
        </Box>
        
        <Box mb={2}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ px: 3, mb: 1, display: 'block' }}
          >
            Support
          </Typography>
          <List disablePadding>{renderNavItems(supportNavigation)}</List>
        </Box>
      </Box>
    </Box>
  );
  
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: `${drawerWidth}px`,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;