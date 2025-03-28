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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useVehicles } from '../../../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import AddVehicleDialog from '../components/AddVehicleDialog';
import DeleteVehicleDialog from '../components/DeleteVehicleDialog';

const Vehicles: React.FC = () => {
  const { data: vehicles, isLoading, error } = useVehicles();
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const handleEditVehicle = (id: string) => {
    console.log(`Edit vehicle ${id}`);
    // In a real app, navigate to edit page or open edit modal
  };
  
  const handleDeleteClick = (id: string) => {
    setSelectedVehicleId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedVehicleId(null);
  };

  const handleAddVehicleClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };
  
  const filteredVehicles = vehicles
    ? vehicles.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Veículos
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddVehicleClick}
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
          placeholder="Pesquisar veículos..."
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
            Filtrar
          </Button>
          <Button variant="outlined" startIcon={<SortIcon />}>
            Ordenar
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
                      onClick={handleAddVehicleClick}
                    >
                      Adicionar Veículo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
          
          {/* Componentes de diálogo */}
          <DeleteVehicleDialog 
            open={deleteDialogOpen} 
            onClose={handleCloseDeleteDialog}
            vehicleId={selectedVehicleId}
          />

          <AddVehicleDialog 
            open={createDialogOpen} 
            onClose={handleCloseCreateDialog}
          />
        </>
      )}
    </Box>
  );
};

export default Vehicles;