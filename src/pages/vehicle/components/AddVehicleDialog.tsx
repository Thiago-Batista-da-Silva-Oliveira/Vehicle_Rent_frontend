import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { VehicleFormData } from '../../../types/Vehicle';
import { useCreateVehicle } from '../../../services/vehicleService';

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: VehicleFormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  fuelType: 'gasoline',
  mileage: 0,
  purchaseValue: 0,
  description: '',
  categoryId: '',
  tenantId: '',
  chassisNumber: '',
};

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ open, onClose }) => {
  const createVehicleMutation = useCreateVehicle();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    defaultValues,
  });

  const handleCloseDialog = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await createVehicleMutation.mutateAsync(data);
      handleCloseDialog();
    } catch (error) {
      // O erro já está sendo tratado pelo hook useCreateVehicle
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Adicionar Novo Veículo
        <IconButton 
          onClick={handleCloseDialog} 
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="brand"
                control={control}
                rules={{ required: 'Marca é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marca"
                    fullWidth
                    error={!!errors.brand}
                    helperText={errors.brand?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="model"
                control={control}
                rules={{ required: 'Modelo é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Modelo"
                    fullWidth
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="year"
                control={control}
                rules={{ 
                  required: 'Ano é obrigatório',
                  min: {
                    value: 1900,
                    message: 'Ano deve ser depois de 1900'
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Ano deve ser anterior a ${new Date().getFullYear() + 1}`
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ano"
                    type="number"
                    fullWidth
                    error={!!errors.year}
                    helperText={errors.year?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="plate"
                control={control}
                rules={{ required: 'Placa é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Placa"
                    fullWidth
                    error={!!errors.plate}
                    helperText={errors.plate?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="color"
                control={control}
                rules={{ required: 'Cor é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cor"
                    fullWidth
                    error={!!errors.color}
                    helperText={errors.color?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="fuelType"
                control={control}
                rules={{ required: 'Tipo de combustível é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fuelType}>
                    <InputLabel id="fuel-type-label">Combustível</InputLabel>
                    <Select
                      {...field}
                      labelId="fuel-type-label"
                      label="Combustível"
                    >
                      <MenuItem value="gasoline">Gasolina</MenuItem>
                      <MenuItem value="diesel">Diesel</MenuItem>
                      <MenuItem value="electric">Elétrico</MenuItem>
                      <MenuItem value="hybrid">Híbrido</MenuItem>
                    </Select>
                    {errors.fuelType && (
                      <FormHelperText>{errors.fuelType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="mileage"
                control={control}
                rules={{ 
                  required: 'Quilometragem é obrigatória',
                  min: {
                    value: 0,
                    message: 'Quilometragem deve ser positiva'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quilometragem (km)"
                    type="number"
                    fullWidth
                    error={!!errors.mileage}
                    helperText={errors.mileage?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="purchaseValue"
                control={control}
                rules={{ 
                  required: 'Valor da diária é obrigatório',
                  min: {
                    value: 0,
                    message: 'Valor da diária deve ser positivo'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor da Diária (R$)"
                    type="number"
                    fullWidth
                    error={!!errors.purchaseValue}
                    helperText={errors.purchaseValue?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    multiline
                    rows={4}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={isSubmitting || createVehicleMutation.isLoading}
          >
            {createVehicleMutation.isLoading ? <CircularProgress size={24} /> : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddVehicleDialog; 