import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Typography,
  Divider,
  Box,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { useGenerateRental, useCalculateRental } from '../../../services/rentalService';
import { useCustomers } from '../../../services/customerService';

interface RentalFormProps {
  open: boolean;
  onClose: () => void;
}

interface RentalFormData {
  startDate: Date;
  endDate: Date;
  customerId: string;
  vehicleId: string;
  checkoutMileage?: number;
  observations?: string;
  dailyRate?: number;
  totalAmount?: number;
  depositAmount?: number;
  useAutomaticCalculation: boolean;
}

const RentalForm: React.FC<RentalFormProps> = ({ open, onClose }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [vehicles, setVehicles] = useState<Array<{ id: string, name: string }>>([
    { id: 'vehicle-1', name: 'Honda Civic 2023' },
    { id: 'vehicle-2', name: 'Toyota Corolla 2022' },
    { id: 'vehicle-3', name: 'Hyundai HB20 2023' },
  ]);
  
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const generateRental = useGenerateRental();
  const calculateRental = useCalculateRental();
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RentalFormData>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias à frente
      customerId: '',
      vehicleId: '',
      checkoutMileage: 0,
      observations: '',
      dailyRate: 0,
      totalAmount: 0,
      depositAmount: 0,
      useAutomaticCalculation: true
    }
  });
  
  const watchVehicleId = watch('vehicleId');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchUseAutoCalc = watch('useAutomaticCalculation');
  
  useEffect(() => {
    // Se veículo, data inicial e final estiverem presentes, calcula automaticamente
    if (watchVehicleId && watchStartDate && watchEndDate && watchUseAutoCalc) {
      handleCalculateRates();
    }
  }, [watchVehicleId, watchStartDate, watchEndDate, watchUseAutoCalc]);
  
  const handleCalculateRates = async () => {
    if (!watchVehicleId || !watchStartDate || !watchEndDate) return;
    
    setIsCalculating(true);
    try {
      const result = await calculateRental.mutateAsync({
        vehicleId: watchVehicleId,
        startDate: watchStartDate,
        endDate: watchEndDate
      });
      
      setValue('dailyRate', result.dailyRate);
      setValue('totalAmount', result.totalAmount);
      setValue('depositAmount', result.depositAmount);
    } catch (error) {
      console.error('Error calculating rental rates:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const onSubmit = async (data: RentalFormData) => {
    try {
      await generateRental.mutateAsync({
        startDate: data.startDate,
        endDate: data.endDate,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        checkoutMileage: data.checkoutMileage,
        observations: data.observations,
        dailyRate: data.useAutomaticCalculation ? undefined : data.dailyRate,
        totalAmount: data.useAutomaticCalculation ? undefined : data.totalAmount,
        depositAmount: data.useAutomaticCalculation ? undefined : data.depositAmount,
        useAutomaticCalculation: data.useAutomaticCalculation
      });
      
      handleClose();
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  };
  
  const handleClose = () => {
    reset();
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Novo Aluguel</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Informações Básicas
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="customerId"
                control={control}
                rules={{ required: 'Cliente é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.customerId}>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      {...field}
                      label="Cliente"
                      disabled={isLoadingCustomers}
                    >
                      {isLoadingCustomers ? (
                        <MenuItem value="">Carregando...</MenuItem>
                      ) : (
                        customers.map(customer => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.customerId && (
                      <FormHelperText>{errors.customerId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="vehicleId"
                control={control}
                rules={{ required: 'Veículo é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicleId}>
                    <InputLabel>Veículo</InputLabel>
                    <Select
                      {...field}
                      label="Veículo"
                    >
                      {vehicles.map(vehicle => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vehicleId && (
                      <FormHelperText>{errors.vehicleId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Data de início é obrigatória' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Início"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: 'Data de término é obrigatória' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Término"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="checkoutMileage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quilometragem Inicial"
                    type="number"
                    fullWidth
                    error={!!errors.checkoutMileage}
                    helperText={errors.checkoutMileage?.message}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Km</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="observations"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observações"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Valores
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="useAutomaticCalculation"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        id="useAutocalc"
                      />
                      <label htmlFor="useAutocalc" style={{ marginLeft: '8px' }}>
                        Usar cálculo automático
                      </label>
                    </Box>
                  </FormControl>
                )}
              />
            </Grid>
            
            {watchUseAutoCalc ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {isCalculating ? (
                    <CircularProgress size={30} sx={{ mr: 2 }} />
                  ) : (
                    <Button
                      onClick={handleCalculateRates}
                      variant="outlined"
                      disabled={!watchVehicleId || !watchStartDate || !watchEndDate}
                    >
                      Calcular Valores
                    </Button>
                  )}
                </Box>
              </Grid>
            ) : null}
            
            <Grid item xs={12} md={4}>
              <Controller
                name="dailyRate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Diária"
                    type="number"
                    fullWidth
                    disabled={watchUseAutoCalc}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Total"
                    type="number"
                    fullWidth
                    disabled={watchUseAutoCalc}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="depositAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor do Depósito"
                    type="number"
                    fullWidth
                    disabled={watchUseAutoCalc}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || isCalculating}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Criar Aluguel'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RentalForm; 