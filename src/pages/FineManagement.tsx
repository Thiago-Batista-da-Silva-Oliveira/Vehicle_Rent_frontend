import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  useTheme,
  alpha,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  DirectionsCar as CarIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Sort as SortIcon,
  PhotoCamera as PhotoCameraIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockResponse } from '../services/api';
import { useClients } from '../services/clientService';
import { useVehicles } from '../services/vehicleService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Define Fine type
interface Fine {
  id: string;
  vehicleId: string;
  clientId: string;
  description: string;
  amount: number;
  location: string;
  date: string;
  type: FineType;
  status: 'paid' | 'pending' | 'contested';
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

type FineType = 'speeding' | 'parking' | 'red-light' | 'no-license' | 'other';

// Mock data for fines
const fetchFines = async (): Promise<Fine[]> => {
  const fines: Fine[] = [
    {
      id: '1',
      vehicleId: '1',
      clientId: '1',
      description: 'Speeding ticket - 20mph over limit',
      amount: 180,
      location: 'Main Street, Boston',
      date: '2023-03-15T14:30:00Z',
      type: 'speeding',
      status: 'paid',
      createdAt: '2023-03-15T16:45:00Z',
      updatedAt: '2023-03-16T10:20:00Z',
    },
    {
      id: '2',
      vehicleId: '2',
      clientId: '3',
      description: 'Illegal parking in restricted zone',
      amount: 120,
      location: 'Oak Avenue, San Francisco',
      date: '2023-03-20T09:15:00Z',
      type: 'parking',
      status: 'pending',
      createdAt: '2023-03-20T11:30:00Z',
      updatedAt: '2023-03-20T11:30:00Z',
    },
    {
      id: '3',
      vehicleId: '3',
      clientId: '2',
      description: 'Running red light at intersection',
      amount: 250,
      location: 'Pine Street & 5th Avenue, Seattle',
      date: '2023-03-18T17:45:00Z',
      type: 'red-light',
      status: 'contested',
      createdAt: '2023-03-19T08:15:00Z',
      updatedAt: '2023-03-22T14:10:00Z',
    },
    {
      id: '4',
      vehicleId: '1',
      clientId: '1',
      description: 'Speeding ticket - 15mph over limit',
      amount: 150,
      location: 'Highway 101, San Jose',
      date: '2023-04-02T11:20:00Z',
      type: 'speeding',
      status: 'pending',
      createdAt: '2023-04-02T13:40:00Z',
      updatedAt: '2023-04-02T13:40:00Z',
    },
    {
      id: '5',
      vehicleId: '4',
      clientId: '5',
      description: 'No valid license displayed',
      amount: 100,
      location: 'Cedar Road, Austin',
      date: '2023-04-05T15:30:00Z',
      type: 'no-license',
      status: 'paid',
      createdAt: '2023-04-05T16:45:00Z',
      updatedAt: '2023-04-06T09:30:00Z',
    },
    {
      id: '6',
      vehicleId: '5',
      clientId: '4',
      description: 'Parking in disabled spot without permit',
      amount: 300,
      location: 'Market Street, Chicago',
      date: '2023-04-08T10:15:00Z',
      type: 'parking',
      status: 'pending',
      createdAt: '2023-04-08T12:30:00Z',
      updatedAt: '2023-04-08T12:30:00Z',
    },
    {
      id: '7',
      vehicleId: '3',
      clientId: '2',
      description: 'Excessive speeding - 30mph over limit',
      amount: 350,
      location: 'Interstate 5, Portland',
      date: '2023-04-10T13:45:00Z',
      type: 'speeding',
      status: 'paid',
      createdAt: '2023-04-10T15:20:00Z',
      updatedAt: '2023-04-11T09:15:00Z',
    },
    {
      id: '8',
      vehicleId: '2',
      clientId: '3',
      description: 'Running stop sign',
      amount: 150,
      location: 'Elm Street & Maple Road, Los Angeles',
      date: '2023-04-12T16:30:00Z',
      type: 'other',
      status: 'contested',
      createdAt: '2023-04-12T18:10:00Z',
      updatedAt: '2023-04-15T11:45:00Z',
    },
    {
      id: '9',
      vehicleId: '1',
      clientId: '1',
      description: 'Illegal U-turn at intersection',
      amount: 120,
      location: 'Broadway & 34th Street, New York',
      date: '2023-04-15T12:10:00Z',
      type: 'other',
      status: 'pending',
      createdAt: '2023-04-15T14:25:00Z',
      updatedAt: '2023-04-15T14:25:00Z',
    },
    {
      id: '10',
      vehicleId: '4',
      clientId: '5',
      description: 'Parking meter violation',
      amount: 80,
      location: 'River Street, New Orleans',
      date: '2023-04-18T09:45:00Z',
      type: 'parking',
      status: 'paid',
      createdAt: '2023-04-18T11:30:00Z',
      updatedAt: '2023-04-19T10:15:00Z',
    },
  ];
  
  return mockResponse(fines, 800);
};

// Fine type labels and colors
const fineTypeLabels: Record<FineType, string> = {
  'speeding': 'Speeding',
  'parking': 'Parking Violation',
  'red-light': 'Red Light Violation',
  'no-license': 'License Issue',
  'other': 'Other Violation'
};

const fineTypeColors: Record<FineType, string> = {
  'speeding': '#f44336', // red
  'parking': '#2196f3', // blue
  'red-light': '#ff9800', // orange
  'no-license': '#9c27b0', // purple
  'other': '#607d8b' // blue-gray
};

const fineStatusColors = {
  'paid': 'success',
  'pending': 'warning',
  'contested': 'error'
};

// Dashboard component
const FinesDashboard: React.FC = () => {
  const theme = useTheme();
  const { data: fines = [], isLoading } = useQuery(['fines'], fetchFines);
  const { data: clients = [] } = useClients();
  const { data: vehicles = [] } = useVehicles();
  
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Process data for the charts
  
  // Fines by client
  const finesByClient = clients.map(client => {
    const clientFines = fines.filter(fine => fine.clientId === client.id);
    const fineCount = clientFines.length;
    const totalAmount = clientFines.reduce((sum, fine) => sum + fine.amount, 0);
    
    return {
      clientId: client.id,
      clientName: client.name,
      fineCount,
      totalAmount
    };
  }).sort((a, b) => b.fineCount - a.fineCount).slice(0, 5); // Top 5 clients
  
  // Fines by type
  const finesByType = Object.entries(
    fines.reduce((acc, fine) => {
      acc[fine.type] = (acc[fine.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    type: fineTypeLabels[type as FineType],
    count,
    color: fineTypeColors[type as FineType]
  }));
  
  // Fines by status
  const finesByStatus = Object.entries(
    fines.reduce((acc, fine) => {
      acc[fine.status] = (acc[fine.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));
  
  // Total amount by month
  const finesByMonth = fines.reduce((acc, fine) => {
    const month = new Date(fine.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + fine.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const monthlyData = Object.entries(finesByMonth).map(([month, amount]) => ({
    month,
    amount
  }));
  
  // Total stats
  const totalFines = fines.length;
  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidAmount = fines.filter(fine => fine.status === 'paid')
    .reduce((sum, fine) => sum + fine.amount, 0);
  const pendingAmount = fines.filter(fine => fine.status === 'pending')
    .reduce((sum, fine) => sum + fine.amount, 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Fines
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalFines}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Traffic violations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(totalAmount)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <MoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  From all violations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Paid Amount
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(paidAmount)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(paidAmount / totalAmount) * 100} 
                    color="success" 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Pending Amount
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(pendingAmount)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(pendingAmount / totalAmount) * 100} 
                    color="warning" 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Fine Amounts
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartTooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill={theme.palette.primary.main} 
                      name="Amount" 
                      barSize={40}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fines by Type
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={finesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, count, percent }) => 
                        `${type}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {finesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Top Drivers with Most Fines */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Drivers with Most Fines
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Number of Fines</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Percentage of All Fines</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finesByClient.map((client) => (
                  <TableRow key={client.clientId}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: theme.palette.primary.main 
                          }}
                        >
                          {client.clientName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1">
                          {client.clientName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {client.fineCount}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`${(client.fineCount / totalFines * 100).toFixed(1)}%`}
                          sx={{ ml: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(client.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(client.totalAmount / totalAmount) * 100} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {((client.totalAmount / totalAmount) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

// Fine list component
const FinesList: React.FC = () => {
  const theme = useTheme();
  const { data: fines = [], isLoading } = useQuery(['fines'], fetchFines);
  const { data: clients = [] } = useClients();
  const { data: vehicles = [] } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Filter the fines based on search term and filters
  const filteredFines = fines.filter(fine => {
    const client = clients.find(c => c.id === fine.clientId);
    const vehicle = vehicles.find(v => v.id === fine.vehicleId);
    
    const matchesSearch = 
      fine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle && `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    const matchesType = typeFilter === 'all' || fine.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="Search fines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, minWidth: { sm: '320px' } }}>
          <FormControl variant="outlined" fullWidth size="medium">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="contested">Contested</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth size="medium">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="speeding">Speeding</MenuItem>
              <MenuItem value="parking">Parking</MenuItem>
              <MenuItem value="red-light">Red Light</MenuItem>
              <MenuItem value="no-license">License Issue</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[2] }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    No fines found. Try adjusting your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredFines.map((fine) => {
                const client = clients.find(c => c.id === fine.clientId);
                const vehicle = vehicles.find(v => v.id === fine.vehicleId);
                
                return (
                  <TableRow 
                    key={fine.id}
                    sx={{ 
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            bgcolor: alpha(fineTypeColors[fine.type], 0.1),
                            color: fineTypeColors[fine.type],
                          }}
                        >
                          {fine.type === 'speeding' && <WarningIcon />}
                          {fine.type === 'parking' && <LocationIcon />}
                          {fine.type === 'red-light' && <WarningIcon />}
                          {fine.type === 'no-license' && <DescriptionIcon />}
                          {fine.type === 'other' && <WarningIcon />}
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {fine.description}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {fineTypeLabels[fine.type]}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 28, 
                            height: 28, 
                            mr: 1, 
                            bgcolor: theme.palette.primary.main 
                          }}
                        >
                          {client ? client.name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Typography variant="body2">
                          {client ? client.name : 'Unknown Driver'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {fine.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(fine.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(fine.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={fine.status} 
                        color={fineStatusColors[fine.status] as 'success' | 'warning' | 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Main fines page component
const FinesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Traffic Fines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new fine')}
        >
          Add Fine
        </Button>
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Dashboard" />
          <Tab label="All Fines" />
        </Tabs>
      </Card>
      
      {tabValue === 0 ? (
        <FinesDashboard />
      ) : (
        <FinesList />
      )}
    </Box>
  );
};

export default FinesPage;