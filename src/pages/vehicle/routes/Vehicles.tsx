import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';
import { useDeleteVehicle, useVehicles } from '../../../services/vehicleService';
import { Vehicle } from '../../../types/Vehicle';

const statusColors: any = {
  available: 'success',
  rented: 'primary',
  maintenance: 'warning',
  inactive: 'error',
};

const VehicleCard: React.FC<{
  vehicle: Vehicle;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ vehicle, onEdit, onDelete }) => {
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
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
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
        )}
        
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
            {vehicle.make} {vehicle.model}
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
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onDelete(vehicle.id);
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {vehicle.year} • {vehicle.licensePlate} • {vehicle.color}
        </Typography>
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="textSecondary">
              Daily Rate
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {formatCurrency(vehicle.dailyRate)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="textSecondary">
              Mileage
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {vehicle.mileage.toLocaleString()} mi
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="textSecondary">
              Fuel
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Vehicles: React.FC = () => {
  const { data: vehicles, isLoading, error } = useVehicles();
  const deleteVehicle = useDeleteVehicle();
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  const handleEditVehicle = (id: string) => {
    console.log(`Edit vehicle ${id}`);
    // In a real app, navigate to edit page or open edit modal
  };
  
  const handleDeleteClick = (id: string) => {
    setSelectedVehicleId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (selectedVehicleId) {
      try {
        await deleteVehicle.mutateAsync(selectedVehicleId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    setDeleteDialogOpen(false);
  };
  
  const filteredVehicles = vehicles
    ? vehicles.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.licensePlate.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Vehicles
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Adicionar veículo')}
        >
          Adicionar Veículo
        </Button>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button variant="outlined" startIcon={<SortIcon />}>
            Sort
          </Button>
        </Box>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Card>
          <CardContent>
            <Typography color="error">Erro ao carregar veículos. Por favor, tente novamente.</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredVehicles.map((vehicle) => (
              <Grid item key={vehicle.id} xs={12} sm={6} md={4} lg={3}>
                <VehicleCard
                  vehicle={vehicle}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
            
            {filteredVehicles.length === 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" mb={1}>
                      Nenhum veículo encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {search ? `Nenhum resultado para "${search}"` : 'Adicione seu primeiro veículo para começar'}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => console.log('Adicionar veículo')}
                    >
                      Adicionar Veículo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
          
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this vehicle? This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleConfirmDelete}
                color="error"
                disabled={deleteVehicle.isLoading}
              >
                {deleteVehicle.isLoading ? <CircularProgress size={24} /> : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Vehicles;