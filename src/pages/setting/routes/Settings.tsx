import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  useTheme,
  Avatar,
  TextField,
  IconButton,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  AccountBox as AccountIcon,
} from '@mui/icons-material';
import useSettingsStore from '../../../store/settingsStore';
import useAuthStore from '../../../store/authStore';
import { AccentColor } from '../../../styles/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
};

const ColorCircle: React.FC<{
  color: string;
  selected: boolean;
  onClick: () => void;
}> = ({ color, selected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        bgcolor: color,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: (theme) =>
          selected ? `2px solid ${theme.palette.common.white}` : 'none',
        boxShadow: selected ? '0 0 0 2px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      }}
    >
      {selected && <CheckIcon sx={{ color: 'white', fontSize: 18 }} />}
    </Box>
  );
};

const Settings: React.FC = () => {
  const theme = useTheme();
  const { colorMode, accentColor, setColorMode, setAccentColor } = useSettingsStore();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const colorOptions: { label: string; value: AccentColor; color: string }[] = [
    { label: 'Blue', value: 'blue', color: '#3a86ff' },
    { label: 'Green', value: 'green', color: '#10b981' },
    { label: 'Purple', value: 'purple', color: '#8b5cf6' },
    { label: 'Orange', value: 'orange', color: '#f97316' },
    { label: 'Teal', value: 'teal', color: '#14b8a6' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Tabs
                orientation="vertical"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '.MuiTabs-indicator': {
                    left: 0,
                  },
                }}
              >
                <Tab
                  icon={<AccountIcon />}
                  label="Account"
                  {...a11yProps(0)}
                  sx={{ alignItems: 'flex-start', minHeight: 60 }}
                />
                <Tab
                  icon={<PaletteIcon />}
                  label="Appearance"
                  {...a11yProps(1)}
                  sx={{ alignItems: 'flex-start', minHeight: 60 }}
                />
                <Tab
                  icon={<NotificationsIcon />}
                  label="Notifications"
                  {...a11yProps(2)}
                  sx={{ alignItems: 'flex-start', minHeight: 60 }}
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Security"
                  {...a11yProps(3)}
                  sx={{ alignItems: 'flex-start', minHeight: 60 }}
                />
              </Tabs>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Account Settings
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      mb: { xs: 2, sm: 0 },
                      mr: { sm: 3 },
                    }}
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      sx={{ width: 100, height: 100 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user?.name || 'John Doe'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {user?.email || 'john.doe@example.com'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Member since:{' '}
                      {new Date(user?.createdAt || '2023-01-01').toLocaleDateString()}
                    </Typography>
                    <Box mt={1}>
                      <Button variant="outlined" size="small">
                        Change Avatar
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      defaultValue={user?.name || 'John Doe'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      defaultValue={user?.email || 'john.doe@example.com'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      variant="outlined"
                      defaultValue="Vehicle Rentx"
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="contained">Save Changes</Button>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Appearance Settings
                </Typography>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Theme Mode
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'background.paper',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {colorMode === 'light' ? (
                        <LightModeIcon sx={{ color: 'warning.main', mr: 2 }} />
                      ) : (
                        <DarkModeIcon sx={{ color: 'primary.main', mr: 2 }} />
                      )}
                      <div>
                        <Typography variant="body1" fontWeight="medium">
                          {colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {colorMode === 'light'
                            ? 'Use light theme for a brighter appearance'
                            : 'Use dark theme to reduce eye strain'}
                        </Typography>
                      </div>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={colorMode === 'dark'}
                          onChange={() =>
                            setColorMode(colorMode === 'light' ? 'dark' : 'light')
                          }
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Accent Color
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Choose a primary color for your interface
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {colorOptions.map((option) => (
                      <Box key={option.value} sx={{ textAlign: 'center' }}>
                        <ColorCircle
                          color={option.color}
                          selected={accentColor === option.value}
                          onClick={() => setAccentColor(option.value)}
                        />
                        <Typography variant="caption" display="block" mt={0.5}>
                          {option.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 2,
                    mb: 4,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      Theme settings are saved automatically and will persist between sessions
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Notification Settings
                </Typography>

                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Email Notifications
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="New rental requests"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Upcoming maintenance reminders"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Client account updates"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Marketing updates and newsletters"
                      />
                    </CardContent>
                  </Card>
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Push Notifications
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Rental status changes"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Vehicle alerts"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Payment confirmations"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Feature updates and tips"
                      />
                    </CardContent>
                  </Card>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" sx={{ mr: 1 }}>Reset to Default</Button>
                  <Button variant="contained">Save Changes</Button>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Security Settings
                </Typography>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Change Password
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained">Update Password</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Two-Factor Authentication
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Enable two-factor authentication
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Add an extra layer of security to your account
                          </Typography>
                        </Box>
                        <Switch defaultChecked color="primary" />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Session Management
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" gutterBottom>
                        You're currently logged in on these devices:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Windows 11 • Chrome
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Current session • Last active: Now
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="success.main">
                          Active
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            iPhone 14 • Safari
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Last active: 2 hours ago
                          </Typography>
                        </Box>
                        <Button size="small" variant="outlined" color="error">
                          Log out
                        </Button>
                      </Box>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button color="error">Log out of all devices</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;