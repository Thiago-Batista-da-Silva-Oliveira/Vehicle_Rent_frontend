import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  alpha,
  MenuItem,
  Menu,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  PeopleAlt as PeopleAltIcon,
  AltRoute as AltRouteIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { mockResponse } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useClients } from '../../services/clientService';
import { useVehicles } from '../../services/vehicleService';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Admin dashboard stats type
interface AdminStats {
  totalUsers: number;
  totalVehicles: number;
  totalClients: number;
  totalRevenue: number;
  revenueGrowth: number;
  activeRentals: number;
  revenueByMonth: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  vehicleStatusCounts: {
    status: string;
    count: number;
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
    avatar?: string;
  }[];
  recentActivity: {
    id: string;
    type: 'user' | 'vehicle' | 'client' | 'payment' | 'system';
    message: string;
    timestamp: string;
    user?: string;
  }[];
  systemHealth: {
    status: 'good' | 'warning' | 'critical';
    uptime: number;
    cpu: number;
    memory: number;
    storage: number;
    lastBackup: string;
  };
}

// Fetch admin dashboard stats
const fetchAdminStats = async (): Promise<AdminStats> => {
  const stats: AdminStats = {
    totalUsers: 45,
    totalVehicles: 128,
    totalClients: 312,
    totalRevenue: 287450,
    revenueGrowth: 12.5,
    activeRentals: 78,
    revenueByMonth: [
      { month: 'Jan', revenue: 18500, expenses: 12000, profit: 6500 },
      { month: 'Feb', revenue: 21300, expenses: 13500, profit: 7800 },
      { month: 'Mar', revenue: 25600, expenses: 14200, profit: 11400 },
      { month: 'Apr', revenue: 23400, expenses: 14800, profit: 8600 },
      { month: 'May', revenue: 28900, expenses: 16300, profit: 12600 },
      { month: 'Jun', revenue: 31200, expenses: 17500, profit: 13700 },
    ],
    vehicleStatusCounts: [
      { status: 'available', count: 52 },
      { status: 'rented', count: 48 },
      { status: 'maintenance', count: 18 },
      { status: 'inactive', count: 10 },
    ],
    recentUsers: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Admin',
        lastLogin: '2023-06-15T09:45:00Z',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'Manager',
        lastLogin: '2023-06-14T16:30:00Z',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        role: 'Staff',
        lastLogin: '2023-06-15T11:20:00Z',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      {
        id: '4',
        name: 'Amanda Rodriguez',
        email: 'amanda.r@example.com',
        role: 'Staff',
        lastLogin: '2023-06-14T13:15:00Z',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      {
        id: '5',
        name: 'David Wilson',
        email: 'david.w@example.com',
        role: 'Manager',
        lastLogin: '2023-06-13T10:30:00Z',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'user',
        message: 'New user registered: Emily Clark',
        timestamp: '2023-06-15T14:30:00Z',
      },
      {
        id: '2',
        type: 'vehicle',
        message: 'Vehicle status updated: Tesla Model 3 (Maintenance)',
        timestamp: '2023-06-15T13:45:00Z',
        user: 'John Smith',
      },
      {
        id: '3',
        type: 'payment',
        message: 'New payment received: $1,250.00 from Client #234',
        timestamp: '2023-06-15T11:20:00Z',
      },
      {
        id: '4',
        type: 'client',
        message: 'New client added: Acme Corporation',
        timestamp: '2023-06-15T10:10:00Z',
        user: 'Sarah Johnson',
      },
      {
        id: '5',
        type: 'system',
        message: 'Automated backup completed successfully',
        timestamp: '2023-06-15T02:00:00Z',
      },
      {
        id: '6',
        type: 'vehicle',
        message: 'New vehicle added: Ford F-150 (2022)',
        timestamp: '2023-06-14T16:40:00Z',
        user: 'Michael Chen',
      },
      {
        id: '7',
        type: 'payment',
        message: 'Invoice #INV-2023-0056 marked as paid',
        timestamp: '2023-06-14T15:15:00Z',
        user: 'Amanda Rodriguez',
      },
    ],
    systemHealth: {
      status: 'good',
      uptime: 99.98,
      cpu: 28,
      memory: 42,
      storage: 64,
      lastBackup: '2023-06-15T02:00:00Z',
    },
  };
  
  return mockResponse(stats, 800);
};

// Activity type icons
const activityTypeIcons = {
  'user': <PersonIcon />,
  'vehicle': <CarIcon />,
  'client': <PeopleAltIcon />,
  'payment': <MoneyIcon />,
  'system': <SettingsIcon />,
};

// Status colors
const statusColors = {
  'available': 'success',
  'rented': 'primary',
  'maintenance': 'warning',
  'inactive': 'error',
};

// Dashboard stat card component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon, change, subtitle, color }) => {
  const theme = useTheme();
  const iconBgColor = color || theme.palette.primary.main;
  const isPositive = change && change > 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: alpha(iconBgColor, 0.1),
              color: iconBgColor,
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isPositive ? (
              <ArrowUpwardIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
            ) : (
              <ArrowDownwardIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color={isPositive ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
            </Typography>
          </Box>
        )}
        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// System health status component
const SystemHealthStatus: React.FC<{
  health: AdminStats['systemHealth'];
}> = ({ health }) => {
  const theme = useTheme();
  
  const statusColors = {
    good: theme.palette.success.main,
    warning: theme.palette.warning.main,
    critical: theme.palette.error.main,
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">System Health</Typography>
          <Chip
            label={health.status.toUpperCase()}
            sx={{
              bgcolor: alpha(statusColors[health.status], 0.1),
              color: statusColors[health.status],
              fontWeight: 'bold',
            }}
            size="small"
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">Uptime</Typography>
            <Typography variant="body2" fontWeight="medium">{health.uptime}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={health.uptime}
            color="success"
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">CPU Usage</Typography>
            <Typography variant="body2" fontWeight="medium">{health.cpu}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={health.cpu}
            color={health.cpu > 80 ? 'error' : health.cpu > 60 ? 'warning' : 'success'}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">Memory Usage</Typography>
            <Typography variant="body2" fontWeight="medium">{health.memory}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={health.memory}
            color={health.memory > 80 ? 'error' : health.memory > 60 ? 'warning' : 'success'}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">Storage Usage</Typography>
            <Typography variant="body2" fontWeight="medium">{health.storage}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={health.storage}
            color={health.storage > 80 ? 'error' : health.storage > 60 ? 'warning' : 'success'}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">Last Backup</Typography>
          <Typography variant="body2" fontWeight="medium">
            {new Date(health.lastBackup).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main admin dashboard component
const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const { data: stats, isLoading } = useQuery(['adminStats'], fetchAdminStats);
  const { data: clients = [] } = useClients();
  const { data: vehicles = [] } = useVehicles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  if (isLoading || !stats) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }
  
  // Colors for the pie chart
  const COLORS = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];
  
  // Calculate vehicle utilization rate
  const utilizationRate = stats.vehicleStatusCounts.find(s => s.status === 'rented')?.count || 0;
  const utilizationPercentage = (utilizationRate / stats.totalVehicles) * 100;
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            sx={{ mr: 1 }}
          >
            Generate Report
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Refresh Data</MenuItem>
            <MenuItem onClick={handleMenuClose}>Export Dashboard</MenuItem>
            <MenuItem onClick={handleMenuClose}>Dashboard Settings</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Stats row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PersonIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={<CarIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<PeopleAltIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<MoneyIcon />}
            change={stats.revenueGrowth}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>
      
      {/* Charts row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Revenue Overview</Typography>
                <Box>
                  <Button size="small" sx={{ mr: 1 }}>Monthly</Button>
                  <Button size="small" sx={{ mr: 1 }}>Quarterly</Button>
                  <Button size="small">Yearly</Button>
                </Box>
              </Box>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.revenueByMonth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value) => [`$${value}`, '']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar
                      name="Revenue"
                      dataKey="revenue"
                      stackId="a"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      name="Expenses"
                      dataKey="expenses"
                      stackId="a"
                      fill={theme.palette.error.light}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      name="Profit"
                      dataKey="profit"
                      fill={theme.palette.success.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Status Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.vehicleStatusCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count, percent }) => 
                        `${status}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.vehicleStatusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" align="center">
                  Vehicle Utilization Rate: <strong>{utilizationPercentage.toFixed(1)}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Activity and users section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List sx={{ pt: 0 }}>
                {stats.recentActivity.slice(0, 6).map((activity) => {
                  const activityDate = new Date(activity.timestamp);
                  
                  return (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {activityTypeIcons[activity.type]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.message}
                          secondary={
                            <>
                              {activityDate.toLocaleString()}
                              {activity.user && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textPrimary"
                                  sx={{ display: 'block' }}
                                >
                                  by {activity.user}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined" endIcon={<ArrowDownwardIcon />}>
                  View All Activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              <List sx={{ pt: 0 }}>
                {stats.recentUsers.slice(0, 5).map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={user.name} src={user.avatar}>
                          {user.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {user.role}
                            </Typography>
                            {` — ${user.email}`}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={`Last login: ${new Date(user.lastLogin).toLocaleString()}`}>
                          <IconButton edge="end">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined">
                  Manage Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <SystemHealthStatus health={stats.systemHealth} />
        </Grid>
      </Grid>
      
      {/* Quick actions card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CarIcon />}
                sx={{ py: 1.5 }}
              >
                Add Vehicle
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonIcon />}
                sx={{ py: 1.5 }}
              >
                Add User
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleAltIcon />}
                sx={{ py: 1.5 }}
              >
                Add Client
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BarChartIcon />}
                sx={{ py: 1.5 }}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;