import React, { useEffect } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Customer, CustomerFormData } from '../../../types/Customer';

interface CustomerFormProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, customer, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      document: '',
      documentType: 'CPF',
      type: 'INDIVIDUAL',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
        documentType: customer.documentType,
        type: customer.type,
        address: customer.address,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        document: '',
        documentType: 'CPF',
        type: 'INDIVIDUAL',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });
    }
  }, [customer, reset]);

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmit(data);
    onClose();
    reset();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {customer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome Completo"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'Telefone é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="documentType"
                control={control}
                rules={{ required: 'Tipo de documento é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.documentType}>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Documento"
                    >
                      <MenuItem value="CPF">CPF</MenuItem>
                      <MenuItem value="CNPJ">CNPJ</MenuItem>
                    </Select>
                    {errors.documentType && (
                      <Typography color="error" variant="caption">
                        {errors.documentType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="document"
                control={control}
                rules={{ 
                  required: 'Documento é obrigatório',
                  pattern: {
                    value: /^\d{11}$|^\d{14}$/,
                    message: 'Documento inválido'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número do Documento"
                    fullWidth
                    error={!!errors.document}
                    helperText={errors.document?.message}
                    inputProps={{
                      maxLength: field.value === 'CPF' ? 11 : 14,
                      pattern: '[0-9]*',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Tipo de cliente é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel>Tipo de Cliente</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Cliente"
                    >
                      <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                      <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
                    </Select>
                    {errors.type && (
                      <Typography color="error" variant="caption">
                        {errors.type.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Endereço
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={control}
                rules={{ required: 'Rua é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rua"
                    fullWidth
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.number"
                control={control}
                rules={{ required: 'Número é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número"
                    fullWidth
                    error={!!errors.address?.number}
                    helperText={errors.address?.number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.complement"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Complemento"
                    fullWidth
                    error={!!errors.address?.complement}
                    helperText={errors.address?.complement?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.neighborhood"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bairro"
                    fullWidth
                    error={!!errors.address?.neighborhood}
                    helperText={errors.address?.neighborhood?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.city"
                control={control}
                rules={{ required: 'Cidade é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cidade"
                    fullWidth
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.state"
                control={control}
                rules={{ required: 'Estado é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estado"
                    fullWidth
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.zipCode"
                control={control}
                rules={{ 
                  required: 'CEP é obrigatório',
                  pattern: {
                    value: /^\d{8}$/,
                    message: 'CEP inválido'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CEP"
                    fullWidth
                    error={!!errors.address?.zipCode}
                    helperText={errors.address?.zipCode?.message}
                    inputProps={{
                      maxLength: 8,
                      pattern: '[0-9]*',
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit"
            variant="contained"
            startIcon={customer ? <EditIcon /> : <AddIcon />}
          >
            {customer ? 'Atualizar Cliente' : 'Adicionar Cliente'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerForm; 