import React, { useEffect, useState } from 'react';
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
import { Vehicle, VehicleFormData } from '../../../types/Vehicle';
import { useUpdateVehicle, useVehicle } from '../../../services/vehicleService';
import useNotification from '../../../hooks/useNotification';
import api from '../../../services/api';

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string | null;
}

interface Category {
  id: string;
  name: string;
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
  categoryId: '',
  chassisNumber: '',
  renavamCode: '',
  tenantId: '11111111-1111-1111-1111-111111111111',
};

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({ open, onClose, vehicleId }) => {
  const updateVehicleMutation = useUpdateVehicle();
  const { data: vehicle, isLoading: isLoadingVehicle } = useVehicle(vehicleId || '');
  const notification = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    defaultValues,
  });

  // Carregar categorias quando o modal for aberto
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        // Mock de categorias para desenvolvimento
        setCategories([
          { id: '11111111-1111-1111-1111-111111111111', name: 'Sedan' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'SUV' },
          { id: '33333333-3333-3333-3333-333333333333', name: 'Hatch' },
          { id: '44444444-4444-4444-4444-444444444444', name: 'Pickup' },
        ]);
      } catch (error) {
        notification.showError('Erro ao carregar categorias de veículos');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open, notification]);

  // Preencher o formulário com os dados do veículo quando eles forem carregados
  useEffect(() => {
    if (vehicle) {
      reset({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color,
        fuelType: vehicle.fuelType,
        mileage: vehicle.mileage,
        purchaseValue: vehicle.purchaseValue || 0,
        categoryId: vehicle.categoryId || '',
        chassisNumber: vehicle.chassisNumber || '',
        renavamCode: vehicle.renavamCode || '',
        tenantId: vehicle.tenantId || '11111111-1111-1111-1111-111111111111',
      });
    }
  }, [vehicle, reset]);

  const handleCloseDialog = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data: VehicleFormData) => {
    if (!vehicleId) return;
    
    try {
      // Adicionando a data de compra atual se não for fornecida
      if (!data.purchaseDate) {
        data.purchaseDate = new Date();
      }
      
      await updateVehicleMutation.mutateAsync({
        id: vehicleId,
        data,
      });
      handleCloseDialog();
    } catch (error) {
      // O erro já está sendo tratado pelo hook useUpdateVehicle
    }
  };

  if (isLoadingVehicle) {
    return (
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Editar Veículo
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
                rules={{ 
                  required: 'Placa é obrigatória',
                  pattern: {
                    value: /^[A-Z0-9]{7}$/,
                    message: 'Formato inválido. Use 7 caracteres (letras maiúsculas e números)'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Placa"
                    fullWidth
                    placeholder="ABC1234"
                    error={!!errors.plate}
                    helperText={errors.plate?.message}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
                name="chassisNumber"
                control={control}
                rules={{ required: 'Número do chassi é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número do Chassi"
                    fullWidth
                    error={!!errors.chassisNumber}
                    helperText={errors.chassisNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="renavamCode"
                control={control}
                rules={{ required: 'Código RENAVAM é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código RENAVAM"
                    fullWidth
                    error={!!errors.renavamCode}
                    helperText={errors.renavamCode?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: 'Categoria é obrigatória' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryId}>
                    <InputLabel id="category-label">Categoria</InputLabel>
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Categoria"
                      disabled={loadingCategories}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText>{errors.categoryId.message}</FormHelperText>
                    )}
                  </FormControl>
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
                  required: 'Valor de diária é obrigatório',
                  min: {
                    value: 0,
                    message: 'Valor deve ser positivo'
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={isSubmitting || updateVehicleMutation.isLoading}
          >
            {updateVehicleMutation.isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditVehicleDialog; 