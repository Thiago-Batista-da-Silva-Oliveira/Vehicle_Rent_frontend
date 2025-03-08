import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme,

} from '@mui/material';
import {
  Payments as PaymentsIcon,
  PriceCheck as PriceCheckIcon,
  Receipt as ReceiptIcon,
  ReceiptLong as ReceiptLongIcon,
  Money as MoneyIcon,
  Notifications as NotificationsIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon,
  Paid as PaidIcon,
  History as HistoryIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { mockResponse } from '../services/api';
import { useClients } from '../services/clientService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from 'recharts';

// Define Invoice and Payment types
interface Invoice {
  id: string;
  clientId: string;
  vehicleId?: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  notes?: string;
  services: {
    description: string;
    amount: number;
  }[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'other';
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for invoices
const fetchInvoices = async (): Promise<Invoice[]> => {
  const invoices: Invoice[] = [
    {
      id: '1',
      clientId: '1',
      vehicleId: '1',
      invoiceNumber: 'INV-2023-0001',
      amount: 550,
      dueDate: '2023-05-15T00:00:00Z',
      issueDate: '2023-04-15T00:00:00Z',
      status: 'paid',
      services: [
        { description: 'Monthly vehicle rental', amount: 500 },
        { description: 'Insurance', amount: 50 }
      ],
      payments: [
        {
          id: 'p1',
          invoiceId: '1',
          amount: 550,
          date: '2023-05-10T10:30:00Z',
          method: 'credit_card',
          reference: 'CARD-4567',
          createdAt: '2023-05-10T10:30:00Z',
          updatedAt: '2023-05-10T10:30:00Z'
        }
      ],
      createdAt: '2023-04-15T09:00:00Z',
      updatedAt: '2023-05-10T10:30:00Z'
    },
    {
      id: '2',
      clientId: '2',
      vehicleId: '3',
      invoiceNumber: 'INV-2023-0002',
      amount: 1200,
      dueDate: '2023-05-20T00:00:00Z',
      issueDate: '2023-04-20T00:00:00Z',
      status: 'overdue',
      notes: 'Second notice sent on 2023-05-25',
      services: [
        { description: 'Monthly SUV rental', amount: 1000 },
        { description: 'Premium insurance', amount: 150 },
        { description: 'Additional driver', amount: 50 }
      ],
      payments: [],
      createdAt: '2023-04-20T11:15:00Z',
      updatedAt: '2023-05-25T14:30:00Z'
    },
    {
      id: '3',
      clientId: '3',
      vehicleId: '2',
      invoiceNumber: 'INV-2023-0003',
      amount: 900,
      dueDate: '2023-06-01T00:00:00Z',
      issueDate: '2023-05-01T00:00:00Z',
      status: 'partial',
      services: [
        { description: 'Monthly vehicle rental', amount: 800 },
        { description: 'Insurance', amount: 100 }
      ],
      payments: [
        {
          id: 'p2',
          invoiceId: '3',
          amount: 500,
          date: '2023-05-15T14:45:00Z',
          method: 'bank_transfer',
          reference: 'TRF-12345',
          notes: 'Partial payment, remaining balance due by June 1',
          createdAt: '2023-05-15T14:45:00Z',
          updatedAt: '2023-05-15T14:45:00Z'
        }
      ],
      createdAt: '2023-05-01T10:00:00Z',
      updatedAt: '2023-05-15T14:45:00Z'
    },
    {
      id: '4',
      clientId: '4',
      invoiceNumber: 'INV-2023-0004',
      amount: 300,
      dueDate: '2023-06-05T00:00:00Z',
      issueDate: '2023-05-05T00:00:00Z',
      status: 'pending',
      services: [
        { description: 'Vehicle maintenance service', amount: 300 }
      ],
      payments: [],
      createdAt: '2023-05-05T15:30:00Z',
      updatedAt: '2023-05-05T15:30:00Z'
    },
    {
      id: '5',
      clientId: '5',
      vehicleId: '4',
      invoiceNumber: 'INV-2023-0005',
      amount: 1850,
      dueDate: '2023-06-10T00:00:00Z',
      issueDate: '2023-05-10T00:00:00Z',
      status: 'paid',
      services: [
        { description: 'Monthly pickup truck rental', amount: 1500 },
        { description: 'Premium insurance', amount: 200 },
        { description: 'GPS tracking service', amount: 150 }
      ],
      payments: [
        {
          id: 'p3',
          invoiceId: '5',
          amount: 1850,
          date: '2023-05-20T09:15:00Z',
          method: 'check',
          reference: 'CHK-9876',
          createdAt: '2023-05-20T09:15:00Z',
          updatedAt: '2023-05-20T09:15:00Z'
        }
      ],
      createdAt: '2023-05-10T13:45:00Z',
      updatedAt: '2023-05-20T09:15:00Z'
    },
    {
      id: '6',
      clientId: '1',
      vehicleId: '1',
      invoiceNumber: 'INV-2023-0006',
      amount: 600,
      dueDate: '2023-06-15T00:00:00Z',
      issueDate: '2023-05-15T00:00:00Z',
      status: 'pending',
      services: [
        { description: 'Monthly vehicle rental', amount: 520 },
        { description: 'Insurance', amount: 50 },
        { description: 'Additional services', amount: 30 }
      ],
      payments: [],
      createdAt: '2023-05-15T09:00:00Z',
      updatedAt: '2023-05-15T09:00:00Z'
    },
    {
      id: '7',
      clientId: '2',
      vehicleId: '5',
      invoiceNumber: 'INV-2023-0007',
      amount: 750,
      dueDate: '2023-05-25T00:00:00Z',
      issueDate: '2023-04-25T00:00:00Z',
      status: 'overdue',
      notes: 'First notice sent on 2023-05-26',
      services: [
        { description: 'Vehicle rental (compact)', amount: 650 },
        { description: 'Basic insurance', amount: 100 }
      ],
      payments: [],
      createdAt: '2023-04-25T11:30:00Z',
      updatedAt: '2023-05-26T10:15:00Z'
    },
    {
      id: '8',
      clientId: '3',
      invoiceNumber: 'INV-2023-0008',
      amount: 450,
      dueDate: '2023-06-20T00:00:00Z',
      issueDate: '2023-05-20T00:00:00Z',
      status: 'pending',
      services: [
        { description: 'Vehicle maintenance', amount: 350 },
        { description: 'Parts replacement', amount: 100 }
      ],
      payments: [],
      createdAt: '2023-05-20T14:00:00Z',
      updatedAt: '2023-05-20T14:00:00Z'
    },
    {
      id: '9',
      clientId: '4',
      vehicleId: '2',
      invoiceNumber: 'INV-2023-0009',
      amount: 1100,
      dueDate: '2023-05-05T00:00:00Z',
      issueDate: '2023-04-05T00:00:00Z',
      status: 'overdue',
      notes: 'Sent to collections on 2023-06-05',
      services: [
        { description: 'Monthly vehicle rental', amount: 900 },
        { description: 'Insurance', amount: 120 },
        { description: 'Damage repair', amount: 80 }
      ],
      payments: [],
      createdAt: '2023-04-05T09:45:00Z',
      updatedAt: '2023-06-05T10:30:00Z'
    },
    {
      id: '10',
      clientId: '5',
      vehicleId: '4',
      invoiceNumber: 'INV-2023-0010',
      amount: 1950,
      dueDate: '2023-07-10T00:00:00Z',
      issueDate: '2023-06-10T00:00:00Z',
      status: 'pending',
      services: [
        { description: 'Monthly pickup truck rental', amount: 1550 },
        { description: 'Premium insurance', amount: 220 },
        { description: 'GPS tracking service', amount: 180 }
      ],
      payments: [],
      createdAt: '2023-06-10T13:00:00Z',
      updatedAt: '2023-06-10T13:00:00Z'
    }
  ];
  
  return mockResponse(invoices, 800);
};

// Invoice status colors
const invoiceStatusColors = {
  'paid': 'success',
  'pending': 'info',
  'overdue': 'error',
  'partial': 'warning'
};

// Payment method icons
const paymentMethodIcons = {
  'credit_card': <PaymentsIcon fontSize="small" />,
  'bank_transfer': <AttachMoneyIcon fontSize="small" />,
  'cash': <MoneyIcon fontSize="small" />,
  'check': <ReceiptIcon fontSize="small" />,
  'other': <PriceCheckIcon fontSize="small" />
};

// Collections Dashboard component
const CollectionsDashboard: React.FC = () => {
  const theme = useTheme();
  const { data: invoices = [], isLoading } = useQuery(['invoices'], fetchInvoices);
  const { data: clients = [] } = useClients();
  
  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Process data for the charts
  
  // Total stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPartial = invoices
    .filter(inv => inv.status === 'partial')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  // Calculate the actual collected amount (considering partial payments)
  const actualCollected = invoices.reduce((sum, inv) => {
    if (inv.status === 'paid') {
      return sum + inv.amount;
    } else if (inv.status === 'partial') {
      const partialAmount = inv.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return sum + partialAmount;
    }
    return sum;
  }, 0);
  
  // Invoices by status for pie chart
  const invoicesByStatus = [
    { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length, color: theme.palette.success.main },
    { name: 'Pending', value: invoices.filter(inv => inv.status === 'pending').length, color: theme.palette.info.main },
    { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length, color: theme.palette.error.main },
    { name: 'Partial', value: invoices.filter(inv => inv.status === 'partial').length, color: theme.palette.warning.main }
  ];
  
  // Collection rate (paid amount / total invoiced)
  const collectionRate = totalInvoiced > 0 ? (actualCollected / totalInvoiced) * 100 : 0;
  
  // Clients with highest debt
  const clientsWithDebt = clients.map(client => {
    const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
    const totalOwed = clientInvoices.reduce((sum, inv) => {
      if (inv.status === 'overdue' || inv.status === 'pending') {
        return sum + inv.amount;
      } else if (inv.status === 'partial') {
        const paidAmount = inv.payments.reduce((pSum, p) => pSum + p.amount, 0);
        return sum + (inv.amount - paidAmount);
      }
      return sum;
    }, 0);
    
    return {
      clientId: client.id,
      clientName: client.name,
      totalOwed,
      overdueAmount: clientInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0),
      invoiceCount: clientInvoices.length
    };
  })
  .filter(client => client.totalOwed > 0)
  .sort((a, b) => b.totalOwed - a.totalOwed)
  .slice(0, 5); // Top 5 clients with debt
  
  return (
    <Box sx={{ p: 3 }}>
     <Typography variant="h4" fontWeight="bold" mb={3}>
          Collections Management
        </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Invoiced
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(totalInvoiced)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ReceiptLongIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Across {invoices.length} invoices
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Collected
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(actualCollected)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <PaidIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Collection Rate: {collectionRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Pending/Partial
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(totalPending + totalPartial)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ScheduleIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Due soon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {formatCurrency(totalOverdue)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                <Typography variant="body2" color="error">
                  {invoices.filter(inv => inv.status === 'overdue').length} overdue invoices
                </Typography>
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
                Collection Status
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Total', amount: totalInvoiced },
                      { name: 'Collected', amount: actualCollected },
                      { name: 'Pending', amount: totalPending },
                      { name: 'Partial', amount: totalPartial },
                      { name: 'Overdue', amount: totalOverdue }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'Amount']} />
                    <Bar 
                      dataKey="amount" 
                      name="Amount" 
                      barSize={60}
                      radius={[4, 4, 0, 0]}
                    >
                      {/* Assign colors based on category */}
                      {[
                        { name: 'Total', color: theme.palette.primary.main },
                        { name: 'Collected', color: theme.palette.success.main },
                        { name: 'Pending', color: theme.palette.info.main },
                        { name: 'Partial', color: theme.palette.warning.main },
                        { name: 'Overdue', color: theme.palette.error.main }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
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
                Invoice Status Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={invoicesByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {invoicesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [`${value} invoices`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  {invoicesByStatus.map((status) => (
                    <Box key={status.name} sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: status.color,
                        mx: 'auto',
                        mb: 0.5
                      }} />
                      <Typography variant="caption" display="block">
                        {status.name}: {status.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Clients with Highest Debt */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Clients with Highest Debt
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Total Owed</TableCell>
                  <TableCell>Overdue Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientsWithDebt.length > 0 ? (
                  clientsWithDebt.map((client) => (
                    <TableRow key={client.clientId}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: client.overdueAmount > 0 
                                ? theme.palette.error.main
                                : theme.palette.warning.main
                            }}
                          >
                            {client.clientName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {client.clientName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {client.invoiceCount} invoice(s)
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {formatCurrency(client.totalOwed)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {client.overdueAmount > 0 ? (
                          <Typography variant="body1" color="error" fontWeight="medium">
                            {formatCurrency(client.overdueAmount)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No overdue amount
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<NotificationsIcon />}
                          color={client.overdueAmount > 0 ? 'error' : 'primary'}
                          sx={{ mr: 1 }}
                        >
                          Send Reminder
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<HistoryIcon />}
                        >
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No clients with outstanding debt
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Recent Payment Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Payment Activity
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices
                  .filter(inv => inv.payments.length > 0)
                  .slice(0, 5)
                  .map((invoice) => {
                    const client = clients.find(c => c.id === invoice.clientId);
                    const payment = invoice.payments[0]; // Get the most recent payment
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {client ? client.name : 'Unknown Client'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(payment.amount)}
                          </Typography>
                          {payment.amount < invoice.amount && (
                            <Typography variant="caption" color="textSecondary">
                              of {formatCurrency(invoice.amount)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(payment.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1 }}>
                              {paymentMethodIcons[payment.method]}
                            </Box>
                            <Typography variant="body2">
                              {payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status}
                            color={invoiceStatusColors[invoice.status] as 'success' | 'info' | 'warning' | 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {invoices.filter(inv => inv.payments.length > 0).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No recent payment activity
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Box>
    )
}

export default CollectionsDashboard