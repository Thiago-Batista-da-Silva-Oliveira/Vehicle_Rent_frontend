import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';
import { Vehicle } from '../../../types/Vehicle';

const statusColors: any = {
  available: 'success',
  rented: 'primary',
  maintenance: 'warning',
  inactive: 'error',
};

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          height: 200,
          bgcolor: 'primary.light',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
            }}
          >
            <CarIcon fontSize="large" />
          </Box>
        
        <Chip
          label={vehicle.status}
          color={statusColors[vehicle.status] as 'success' | 'primary' | 'warning' | 'error'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {vehicle.brand} {vehicle.model}
          </Typography>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'vehicle-menu-button',
            }}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              onEdit(vehicle.id);
            }}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onDelete(vehicle.id);
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Excluir
            </MenuItem>
          </Menu>
        </Box>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {vehicle.year} • {vehicle.plate} • {vehicle.color}
        </Typography>
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="textSecondary">
              Valor
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {formatCurrency(vehicle.purchaseValue || 0)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="textSecondary">
              Quilometragem
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {vehicle.mileage.toLocaleString()} km
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="textSecondary">
              Combustível
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {vehicle.fuelType === 'gasoline' ? 'Gasolina' : 
               vehicle.fuelType === 'diesel' ? 'Diesel' : 
               vehicle.fuelType === 'electric' ? 'Elétrico' : 'Híbrido'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleCard; 