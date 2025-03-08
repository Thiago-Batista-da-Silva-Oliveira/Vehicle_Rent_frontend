import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  useTheme 
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockResponse } from '../services/api';
import { formatCurrency } from '../utils/formatters';

// Mock data for dashboard stats
const fetchDashboardStats = async () => {
  const stats = {
    pageViews: {
      total: 442236,
      percentage: 59.3,
      extra: 35000
    },
    users: {
      total: 78250,
      percentage: 70.5,
      extra: 8900
    },
    orders: {
      total: 18800,
      percentage: 27.4,
      extra: 1943
    },
    sales: {
      total: 35078,
      percentage: 27.4,
      extra: 20395
    },
    visitors: [
      { date: 'Jan', visitors: 30, trend: 10 },
      { date: 'Feb', visitors: 35, trend: 25 },
      { date: 'Mar', visitors: 40, trend: 35 },
      { date: 'Apr', visitors: 30, trend: 40 },
      { date: 'May', visitors: 35, trend: 30 },
      { date: 'Jun', visitors: 50, trend: 35 },
      { date: 'Jul', visitors: 40, trend: 50 },
      { date: 'Aug', visitors: 70, trend: 60 },
      { date: 'Sep', visitors: 100, trend: 75 },
      { date: 'Oct', visitors: 90, trend: 90 },
      { date: 'Nov', visitors: 85, trend: 100 },
      { date: 'Dec', visitors: 80, trend: 90 }
    ],
    weeklyIncome: [
      { day: 'Mon', income: 1200 },
      { day: 'Tue', income: 1500 },
      { day: 'Wed', income: 1100 },
      { day: 'Thu', income: 800 },
      { day: 'Fri', income: 1300 },
      { day: 'Sat', income: 1000 },
      { day: 'Sun', income: 1450 }
    ],
    totalWeeklyIncome: 7650
  };
  
  return mockResponse(stats, 800);
};

const StatCard = ({ title, value, percentage, extra, icon }: { 
  title: string; 
  value: string | number; 
  percentage: number; 
  extra: number;
  icon: React.ReactNode; 
}) => {
  const theme = useTheme();
  const isPositive = percentage > 0;
  const color = isPositive ? theme.palette.success.main : theme.palette.error.main;
  
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Box 
            sx={{ 
              bgcolor: isPositive ? 'success.light' : 'error.light',
              color: isPositive ? 'success.main' : 'error.main',
              px: 1, 
              py: 0.5, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" fontWeight="bold">
              {percentage}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          You made an extra <Box component="span" fontWeight="bold">{extra.toLocaleString()}</Box> this year
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [visitorView, setVisitorView] = useState<'month' | 'week'>('week');
  const { data: stats, isLoading } = useQuery(['dashboardStats'], fetchDashboardStats);
  
  if (isLoading || !stats) {
    return <Box p={3}>Loading dashboard data...</Box>;
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>
      
      {/* Stats Row */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Page Views" 
            value={stats.pageViews.total.toLocaleString()} 
            percentage={stats.pageViews.percentage} 
            extra={stats.pageViews.extra}
            icon={<CarIcon />}
          />
        </Grid>
      </Grid>
      
      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Unique Visitor</Typography>
                <Box>
                  <Button 
                    variant={visitorView === 'month' ? 'contained' : 'outlined'} 
                    size="small"
                    onClick={() => setVisitorView('month')}
                    sx={{ mr: 1 }}
                  >
                    Month
                  </Button>
                  <Button 
                    variant={visitorView === 'week' ? 'contained' : 'outlined'} 
                    size="small"
                    onClick={() => setVisitorView('week')}
                  >
                    Week
                  </Button>
                </Box>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.visitors}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke={theme.palette.primary.main} 
                      fillOpacity={1} 
                      fill="url(#colorVisitors)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="trend" 
                      stroke={theme.palette.secondary.main} 
                      fillOpacity={1} 
                      fill="url(#colorTrend)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Income Overview</Typography>
              <Typography variant="h4" fontWeight="bold" mb={4}>
                {formatCurrency(stats.totalWeeklyIncome)}
              </Typography>
              <Typography variant="subtitle2" mb={2}>This Week Statistics</Typography>
              <Box height={220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.weeklyIncome}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <XAxis dataKey="day" />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Income']}
                    />
                    <Bar 
                      dataKey="income" 
                      fill={theme.palette.secondary.main}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard