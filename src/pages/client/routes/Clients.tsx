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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  FormControlLabel,
  Switch,
  useTheme,
  alpha,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Directions as DirectionsIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Link as LinkIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Client } from '../../../types/Client';
import { useClients, useCreateClient, useUpdateClient } from '../../../services/clientService';
import { formatDate, formatPhoneNumber } from '../../../utils/formatters';
import { useVehicles } from '../../../services/vehicleService';


const ClientsList: React.FC<{
  onEdit: (client: Client) => void;
  onAssociateVehicle: (client: Client) => void;
}> = ({ onEdit, onAssociateVehicle }) => {
  const theme = useTheme();
  const { data: clients = [], isLoading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedClient) {
      onEdit(selectedClient);
      handleCloseMenu();
    }
  };

  const handleAssociateVehicle = () => {
    if (selectedClient) {
      onAssociateVehicle(selectedClient);
      handleCloseMenu();
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Typography color="error">Error loading clients. Please try again.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="Search clients..."
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
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            More Filters
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[2] }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    No clients found. Try adjusting your filters or add a new client.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow 
                  key={client.id}
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: client.status === 'active' 
                            ? theme.palette.primary.main 
                            : theme.palette.grey[400],
                        }}
                      >
                        {client.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {client.name}
                        </Typography>
                        {client.documentId && (
                          <Typography variant="caption" color="textSecondary">
                            ID: {client.documentId}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {client.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {client.phone ? formatPhoneNumber(client.phone) : '-'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={client.status} 
                      color={client.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, client)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Client</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAssociateVehicle}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Associate Vehicle</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ color: selectedClient?.status === 'active' ? 'error.main' : 'success.main' }}
        >
          <ListItemIcon>
            {selectedClient?.status === 'active' ? (
              <BlockIcon fontSize="small" color="error" />
            ) : (
              <CheckIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedClient?.status === 'active' ? 'Deactivate Client' : 'Activate Client'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const ClientForm: React.FC<{
  open: boolean;
  client?: Client | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ open, client, onClose, onSubmit }) => {
  const initialFormData = {
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    documentId: client?.documentId || '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^[0-9()-\s+]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {client ? 'Edit Client' : 'Add New Client'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="documentId"
              label="Document ID / License Number"
              value={formData.documentId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={client ? <EditIcon /> : <AddIcon />}
        >
          {client ? 'Update Client' : 'Add Client'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssociateVehicleForm: React.FC<{
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSubmit: (clientId: string, vehicleId: string) => void;
}> = ({ open, client, onClose, onSubmit }) => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [error, setError] = useState('');

  // Filter out vehicles that are already rented or in maintenance
  const availableVehicles = vehicles.filter(
    vehicle => vehicle.status === 'available'
  );

  const handleSubmit = () => {
    if (!selectedVehicleId) {
      setError('Please select a vehicle');
      return;
    }

    if (client) {
      onSubmit(client.id, selectedVehicleId);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Associate Vehicle to Client</DialogTitle>
      <DialogContent dividers>
        {client && (
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Client Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  mr: 2, 
                  bgcolor: 'primary.main',
                }}
              >
                {client.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {client.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {client.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Select Vehicle
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : availableVehicles.length === 0 ? (
          <Typography color="textSecondary">
            No available vehicles. All vehicles are currently rented or in maintenance.
          </Typography>
        ) : (
          <>
            <FormControl fullWidth error={!!error}>
              <InputLabel>Available Vehicles</InputLabel>
              <Select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value as string);
                  setError('');
                }}
                label="Available Vehicles"
              >
                {availableVehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {error && <Typography color="error" variant="caption">{error}</Typography>}
            </FormControl>

            {selectedVehicleId && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Vehicle Details
                </Typography>
                {(() => {
                  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
                  return vehicle ? (
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Make & Model
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.make} {vehicle.model}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              License Plate
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.licensePlate}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Year
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.year}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Color
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.color}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ) : null;
                })()}
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isLoading || !selectedVehicleId}
          startIcon={<LinkIcon />}
        >
          Associate Vehicle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ClientsPage: React.FC = () => {
  const theme = useTheme();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [tabValue, setTabValue] = React.useState(0);
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [associateVehicleOpen, setAssociateVehicleOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setClientFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setClientFormOpen(true);
  };

  const handleAssociateVehicle = (client: Client) => {
    setSelectedClient(client);
    setAssociateVehicleOpen(true);
  };

  const handleClientFormClose = () => {
    setClientFormOpen(false);
  };

  const handleAssociateVehicleClose = () => {
    setAssociateVehicleOpen(false);
  };

  const handleClientSubmit = async (data: any) => {
    try {
      if (selectedClient) {
        await updateClient.mutateAsync({
          id: selectedClient.id,
          data
        });
      } else {
        await createClient.mutateAsync(data);
      }
      setClientFormOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleAssociateVehicleSubmit = async (clientId: string, vehicleId: string) => {
    try {
      // In a real app, this would call an API to associate the vehicle with the client
      console.log(`Associating vehicle ${vehicleId} with client ${clientId}`);
      
      // For the purpose of this demo, we'll just close the dialog
      setAssociateVehicleOpen(false);
    } catch (error) {
      console.error('Error associating vehicle:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Clients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClient}
        >
          Add Client
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
          <Tab label="All Clients" />
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>
      </Card>

      <ClientsList 
        onEdit={handleEditClient}
        onAssociateVehicle={handleAssociateVehicle}
      />

      <ClientForm
        open={clientFormOpen}
        client={selectedClient}
        onClose={handleClientFormClose}
        onSubmit={handleClientSubmit}
      />

      <AssociateVehicleForm
        open={associateVehicleOpen}
        client={selectedClient}
        onClose={handleAssociateVehicleClose}
        onSubmit={handleAssociateVehicleSubmit}
      />
    </Box>
  );
};

export default ClientsPage;