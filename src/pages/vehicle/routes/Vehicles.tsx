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
  Refresh as RefreshIcon,
  DirectionsCar,
} from '@mui/icons-material';
import { useVehicles } from '../../../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import AddVehicleDialog from '../components/AddVehicleDialog';
import DeleteVehicleDialog from '../components/DeleteVehicleDialog';
import EditVehicleDialog from '../components/EditVehicleDialog';

const Vehicles: React.FC = () => {
  const { data: vehicles = [], isLoading, refetch, error } = useVehicles();
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  const handleEditVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setEditDialogOpen(true);
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
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedVehicleId(null);
  };
  
  const handleRefresh = () => {
    refetch();
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
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Atualizar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddVehicleClick}
          >
            Adicionar Veículo
          </Button>
        </Box>
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
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Card>
          <CardContent>
            <Typography color="error">
              Erro ao carregar veículos: {error.message}. Por favor, tente novamente.
            </Typography>
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
                <Card sx={{ py: 8, textAlign: 'center' }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: 'primary.light',
                          borderRadius: '50%',
                          p: 2,
                          mb: 3,
                        }}
                      >
                        <DirectionsCar fontSize="large" sx={{ color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold" mb={1}>
                        Nenhum veículo encontrado
                      </Typography>
                      <Typography variant="body1" color="textSecondary" maxWidth={500} mb={3}>
                        {search 
                          ? `Nenhum resultado para "${search}". Tente usar outros termos de busca.` 
                          : 'Você ainda não possui veículos cadastrados. Adicione seu primeiro veículo para começar a gerenciar sua frota.'}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="large"
                        onClick={handleAddVehicleClick}
                      >
                        Adicionar Veículo
                      </Button>
                    </Box>
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
          
          <EditVehicleDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            vehicleId={selectedVehicleId}
          />
        </>
      )}
    </Box>
  );
};

export default Vehicles;