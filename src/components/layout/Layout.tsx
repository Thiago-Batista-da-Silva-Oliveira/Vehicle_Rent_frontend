import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider, useTheme, Badge, InputBase, alpha, Tooltip } from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon, 
  Mail as MailIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useSettingsStore from '../../store/settingsStore';
import useAuthStore from '../../store/authStore';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2}}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
            position: 'relative',
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
            },
            mr: 2,
            ml: 0,
            width: '100%',
            maxWidth: 400,
            display: { xs: 'none', md: 'flex' },
          }}>
            <Box sx={{ p: 1, height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </Box>
            <InputBase
              placeholder="Ctrl + K"
              sx={{
                color: 'inherit',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(3)})`,
                  width: '100%',
                },
              }}
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {colorMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Messages">
              <IconButton color="inherit">
                <Badge badgeContent={2} color="primary">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box ml={1}>
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar 
                  alt={user?.name || 'User'} 
                  src={user?.avatar} 
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name || 'John Doe'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email || 'john@example.com'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Sidebar
        open={open}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100%',
          overflow: 'auto',
          mt: '64px', // appbar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;