import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Customer } from '../../../types/Customer';
import { useVehicles } from '../../../services/vehicleService';

interface AssociateVehicleFormProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (customerId: string, vehicleId: string) => void;
}

const AssociateVehicleForm: React.FC<AssociateVehicleFormProps> = ({ 
  open, 
  customer, 
  onClose, 
  onSubmit 
}) => {
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

export default AssociateVehicleForm; 