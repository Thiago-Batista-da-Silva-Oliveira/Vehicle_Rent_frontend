import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  FilterList as FilterIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Customer } from '../../../types/Customer';
import { useCustomers } from '../../../services/customerService';
import { formatDate, formatPhoneNumber } from '../../../utils/formatters';

interface CustomersListProps {
  onEdit: (customer: Customer) => void;
  onAssociateVehicle: (customer: Customer) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ onEdit, onAssociateVehicle }) => {
  const theme = useTheme();
  const { data: customers = [], isLoading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
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
    
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    
    return matchesSearch && matchesType;
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
            <InputLabel>Tipo</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Tipo"
            >
              <MenuItem value="all">Todos os Tipos</MenuItem>
              <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
              <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
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
              <TableCell>Tipo</TableCell>
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
                          bgcolor: theme.palette.primary.main,
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
                      label={customer.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'} 
                      color="primary"
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
      </Menu>
    </Box>
  );
};

export default CustomersList; 