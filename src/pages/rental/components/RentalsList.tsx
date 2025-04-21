import React, { useState } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { IRental } from '../../../services/rentalService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RentalsListProps {
  rentals: IRental[];
  onActivate: (rental: IRental) => void;
  onCancel: (rental: IRental) => void;
  onComplete: (rental: IRental) => void;
}

const RentalsList: React.FC<RentalsListProps> = ({ 
  rentals, 
  onActivate, 
  onCancel, 
  onComplete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRental, setSelectedRental] = useState<IRental | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rental: IRental) => {
    setAnchorEl(event.currentTarget);
    setSelectedRental(rental);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRental(null);
  };

  const handleActivate = () => {
    if (selectedRental) {
      onActivate(selectedRental);
      handleMenuClose();
    }
  };

  const handleCancel = () => {
    if (selectedRental) {
      onCancel(selectedRental);
      handleMenuClose();
    }
  };

  const handleComplete = () => {
    if (selectedRental) {
      onComplete(selectedRental);
      handleMenuClose();
    }
  };

  const filteredRentals = rentals.filter(rental => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rental.id.toLowerCase().includes(searchLower) ||
      rental.customerId.toLowerCase().includes(searchLower) ||
      rental.vehicleId.toLowerCase().includes(searchLower)
    );
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Chip label="Agendado" color="info" size="small" />;
      case 'ACTIVE':
        return <Chip label="Ativo" color="success" size="small" />;
      case 'COMPLETED':
        return <Chip label="Concluído" color="primary" size="small" />;
      case 'CANCELLED':
        return <Chip label="Cancelado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar aluguéis..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Nenhum aluguel encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{rental.customerId.substring(0, 8)}...</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CarIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2">{rental.vehicleId.substring(0, 8)}...</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(rental.totalAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Diária: {formatCurrency(rental.dailyRate)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(rental.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, rental)}>
                      <MoreVertIcon />
                    </IconButton>
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
        onClose={handleMenuClose}
      >
        {selectedRental?.status === 'SCHEDULED' && (
          <MenuItem onClick={handleActivate}>
            <PlayArrowIcon sx={{ mr: 1 }} /> Iniciar Aluguel
          </MenuItem>
        )}
        {selectedRental?.status === 'ACTIVE' && (
          <MenuItem onClick={handleComplete}>
            <CheckCircleIcon sx={{ mr: 1 }} /> Concluir Aluguel
          </MenuItem>
        )}
        {(selectedRental?.status === 'SCHEDULED' || selectedRental?.status === 'ACTIVE') && (
          <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
            <CancelIcon sx={{ mr: 1 }} /> Cancelar Aluguel
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default RentalsList; 