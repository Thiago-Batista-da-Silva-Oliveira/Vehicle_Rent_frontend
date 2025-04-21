import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { IRental } from '../../../services/rentalService';
import { format } from 'date-fns';

interface CompleteRentalFormProps {
  open: boolean;
  rental: IRental | null;
  onClose: () => void;
  onSubmit: (data: { actualEndDate: Date; finalMileage: number; observations?: string }) => void;
}

interface CompleteRentalFormData {
  actualEndDate: Date;
  finalMileage: number;
  observations?: string;
}

const CompleteRentalForm: React.FC<CompleteRentalFormProps> = ({
  open,
  rental,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompleteRentalFormData>({
    defaultValues: {
      actualEndDate: new Date(),
      finalMileage: rental?.checkoutMileage ? rental.checkoutMileage + 100 : 0,
      observations: rental?.observations || '',
    },
  });

  React.useEffect(() => {
    if (rental) {
      reset({
        actualEndDate: new Date(),
        finalMileage: rental.checkoutMileage ? rental.checkoutMileage + 100 : 0,
        observations: rental.observations || '',
      });
    }
  }, [rental, reset]);

  const handleFormSubmit = (data: CompleteRentalFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!rental) {
    return null;
  }

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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Concluir Aluguel</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Informações do Aluguel
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Cliente ID:</strong> {rental.customerId}
              </Typography>
              <Typography variant="body2">
                <strong>Veículo ID:</strong> {rental.vehicleId}
              </Typography>
              <Typography variant="body2">
                <strong>Período Original:</strong> {formatDate(rental.startDate)} até {formatDate(rental.endDate)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Valor Total:</strong> {formatCurrency(rental.totalAmount)}
              </Typography>
              <Typography variant="body2">
                <strong>Valor Diária:</strong> {formatCurrency(rental.dailyRate)}
              </Typography>
              <Typography variant="body2">
                <strong>Depósito:</strong> {formatCurrency(rental.depositAmount)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ my: 2, borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Informações de Devolução
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <Controller
                  name="actualEndDate"
                  control={control}
                  rules={{ required: 'Data de devolução é obrigatória' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Devolução"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.actualEndDate,
                          helperText: errors.actualEndDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="finalMileage"
                control={control}
                rules={{ 
                  required: 'Quilometragem final é obrigatória',
                  min: {
                    value: rental.checkoutMileage || 0,
                    message: 'Quilometragem final deve ser maior que a inicial'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quilometragem Final"
                    type="number"
                    fullWidth
                    error={!!errors.finalMileage}
                    helperText={errors.finalMileage?.message}
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
                    label="Observações de Devolução"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Concluir Aluguel'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompleteRentalForm; 