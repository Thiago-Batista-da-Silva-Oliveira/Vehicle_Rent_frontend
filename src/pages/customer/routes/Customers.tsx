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
  Block as BlockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  FilterList as FilterIcon,
  DirectionsCar as CarIcon,
  Link as LinkIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Customer, CustomerFormData } from '../../../types/Customer';
import { 
  useCustomers, 
  useCreateCustomer, 
  useUpdateCustomer,
  useDeleteCustomer
} from '../../../services/customerService';
import { formatDate, formatPhoneNumber } from '../../../utils/formatters';
import { useVehicles } from '../../../services/vehicleService';

const CustomersList: React.FC<{
  onEdit: (customer: Customer) => void;
  onAssociateVehicle: (customer: Customer) => void;
}> = ({ onEdit, onAssociateVehicle }) => {
  const theme = useTheme();
  const { data: customers = [], isLoading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedCustomer) {
      onEdit(selectedCustomer);
      handleCloseMenu();
    }
  };

  const handleAssociateVehicle = () => {
    if (selectedCustomer) {
      onAssociateVehicle(selectedCustomer);
      handleCloseMenu();
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && customer.active) ||
      (statusFilter === 'inactive' && !customer.active);
    
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
        <Typography color="error">Erro ao carregar clientes. Por favor, tente novamente.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="Buscar clientes..."
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
              <MenuItem value="all">Todos os Status</MenuItem>
              <MenuItem value="active">Ativos</MenuItem>
              <MenuItem value="inactive">Inativos</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Mais Filtros
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[2] }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Nome do Cliente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cadastro</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    Nenhum cliente encontrado. Tente ajustar seus filtros ou adicionar um novo cliente.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer.id}
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: customer.active 
                            ? theme.palette.primary.main 
                            : theme.palette.grey[400],
                        }}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {customer.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {customer.documentType}: {customer.document}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {customer.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {customer.phone ? formatPhoneNumber(customer.phone) : '-'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.active ? 'Ativo' : 'Inativo'} 
                      color={customer.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(customer.createdAt.toISOString())}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Mais ações">
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, customer)}
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
          <ListItemText>Editar Cliente</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAssociateVehicle}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Associar Veículo</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ color: selectedCustomer?.active ? 'error.main' : 'success.main' }}
        >
          <ListItemIcon>
            {selectedCustomer?.active ? (
              <BlockIcon fontSize="small" color="error" />
            ) : (
              <CheckIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedCustomer?.active ? 'Desativar Cliente' : 'Ativar Cliente'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const CustomerForm: React.FC<{
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}> = ({ open, customer, onClose, onSubmit }) => {
  const initialFormData: CustomerFormData = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    document: customer?.document || '',
    documentType: customer?.documentType || 'CPF',
    birthDate: customer?.birthDate,
    type: customer?.type || 'INDIVIDUAL',
    address: customer?.address || {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    active: customer?.active ?? true,
    tenantId: '11111111-1111-1111-1111-111111111111', // TODO: Get from context
  };

  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.document.trim()) {
      newErrors.document = 'Documento é obrigatório';
    }
    
    if (!formData.address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }
    
    if (!formData.address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    
    if (!formData.address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!formData.address.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {customer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Nome Completo"
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
              label="Email"
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
              label="Telefone"
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.document}>
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                name="documentType"
                value={formData.documentType}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Tipo de Documento"
              >
                <MenuItem value="CPF">CPF</MenuItem>
                <MenuItem value="CNPJ">CNPJ</MenuItem>
              </Select>
              {errors.document && (
                <Typography color="error" variant="caption">
                  {errors.document}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="document"
              label="Número do Documento"
              value={formData.document}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.document}
              helperText={errors.document}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Cliente</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Tipo de Cliente"
              >
                <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="birthDate"
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setFormData(prev => ({ ...prev, birthDate: date }));
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Endereço
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="street"
              label="Rua"
              value={formData.address.street}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.street}
              helperText={errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="number"
              label="Número"
              value={formData.address.number}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.number}
              helperText={errors.number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="complement"
              label="Complemento"
              value={formData.address.complement}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="neighborhood"
              label="Bairro"
              value={formData.address.neighborhood}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="Cidade"
              value={formData.address.city}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="state"
              label="Estado"
              value={formData.address.state}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="zipCode"
              label="CEP"
              value={formData.address.zipCode}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.zipCode}
              helperText={errors.zipCode}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={customer ? <EditIcon /> : <AddIcon />}
        >
          {customer ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssociateVehicleForm: React.FC<{
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (customerId: string, vehicleId: string) => void;
}> = ({ open, customer, onClose, onSubmit }) => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [error, setError] = useState('');

  const availableVehicles = vehicles.filter(
    vehicle => vehicle.status === 'AVAILABLE'
  );

  const handleSubmit = () => {
    if (!selectedVehicleId) {
      setError('Por favor, selecione um veículo');
      return;
    }

    if (customer) {
      onSubmit(customer.id, selectedVehicleId);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Associar Veículo ao Cliente</DialogTitle>
      <DialogContent dividers>
        {customer && (
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Informações do Cliente
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  mr: 2, 
                  bgcolor: 'primary.main',
                }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {customer.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {customer.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Selecionar Veículo
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : availableVehicles.length === 0 ? (
          <Typography color="textSecondary">
            Nenhum veículo disponível. Todos os veículos estão alugados ou em manutenção.
          </Typography>
        ) : (
          <>
            <FormControl fullWidth error={!!error}>
              <InputLabel>Veículos Disponíveis</InputLabel>
              <Select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value as string);
                  setError('');
                }}
                label="Veículos Disponíveis"
              >
                {availableVehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        {vehicle.brand} {vehicle.model} - {vehicle.plate}
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
                  Detalhes do Veículo Selecionado
                </Typography>
                {(() => {
                  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
                  return vehicle ? (
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Marca & Modelo
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.brand} {vehicle.model}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Placa
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.plate}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Ano
                            </Typography>
                            <Typography variant="body2">
                              {vehicle.year}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="textSecondary">
                              Cor
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isLoading || !selectedVehicleId}
          startIcon={<LinkIcon />}
        >
          Associar Veículo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CustomersPage: React.FC = () => {
  const theme = useTheme();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const [tabValue, setTabValue] = React.useState(0);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [associateVehicleOpen, setAssociateVehicleOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerFormOpen(true);
  };

  const handleAssociateVehicle = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAssociateVehicleOpen(true);
  };

  const handleCustomerFormClose = () => {
    setCustomerFormOpen(false);
  };

  const handleAssociateVehicleClose = () => {
    setAssociateVehicleOpen(false);
  };

  const handleCustomerSubmit = async (data: CustomerFormData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer.mutateAsync({
          id: selectedCustomer.id,
          data
        });
      } else {
        await createCustomer.mutateAsync(data);
      }
      setCustomerFormOpen(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleAssociateVehicleSubmit = async (customerId: string, vehicleId: string) => {
    try {
      // TODO: Implement vehicle association
      console.log(`Associating vehicle ${vehicleId} with customer ${customerId}`);
      setAssociateVehicleOpen(false);
    } catch (error) {
      console.error('Error associating vehicle:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          Adicionar Cliente
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
          <Tab label="Todos os Clientes" />
          <Tab label="Ativos" />
          <Tab label="Inativos" />
        </Tabs>
      </Card>

      <CustomersList 
        onEdit={handleEditCustomer}
        onAssociateVehicle={handleAssociateVehicle}
      />

      <CustomerForm
        open={customerFormOpen}
        customer={selectedCustomer}
        onClose={handleCustomerFormClose}
        onSubmit={handleCustomerSubmit}
      />

      <AssociateVehicleForm
        open={associateVehicleOpen}
        customer={selectedCustomer}
        onClose={handleAssociateVehicleClose}
        onSubmit={handleAssociateVehicleSubmit}
      />
    </Box>
  );
};

export default CustomersPage;