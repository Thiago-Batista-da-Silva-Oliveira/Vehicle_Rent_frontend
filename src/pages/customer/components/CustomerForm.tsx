import React, { useState } from 'react';
import {
  Box,
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
import { Customer, CustomerFormData } from '../../../types/Customer';

interface CustomerFormProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, customer, onClose, onSubmit }) => {
  const initialFormData: CustomerFormData = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    document: customer?.document || '',
    documentType: customer?.documentType || 'CPF',
    type: customer?.type || 'INDIVIDUAL',
    address: customer?.address || {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  };

  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.document.trim()) {
      newErrors.document = 'Documento é obrigatório';
    } else if (formData.documentType === 'CPF' && !/^\d{11}$/.test(formData.document)) {
      newErrors.document = 'CPF inválido';
    } else if (formData.documentType === 'CNPJ' && !/^\d{14}$/.test(formData.document)) {
      newErrors.document = 'CNPJ inválido';
    }
    
    if (!formData.address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }
    
    if (!formData.address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    
    if (!formData.address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!formData.address.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{8}$/.test(formData.address.zipCode)) {
      newErrors.zipCode = 'CEP inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
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
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Nome Completo"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Telefone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.document}>
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                name="documentType"
                value={formData.documentType}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Tipo de Documento"
              >
                <MenuItem value="CPF">CPF</MenuItem>
                <MenuItem value="CNPJ">CNPJ</MenuItem>
              </Select>
              {errors.document && (
                <Typography color="error" variant="caption">
                  {errors.document}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="document"
              label="Número do Documento"
              value={formData.document}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.document}
              helperText={errors.document}
              inputProps={{
                maxLength: formData.documentType === 'CPF' ? 11 : 14,
                pattern: formData.documentType === 'CPF' ? '[0-9]*' : '[0-9]*',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Cliente</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Tipo de Cliente"
              >
                <MenuItem value="INDIVIDUAL">Pessoa Física</MenuItem>
                <MenuItem value="COMPANY">Pessoa Jurídica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Endereço
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="street"
              label="Rua"
              value={formData.address.street}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.street}
              helperText={errors.street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="number"
              label="Número"
              value={formData.address.number}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.number}
              helperText={errors.number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="complement"
              label="Complemento"
              value={formData.address.complement}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="neighborhood"
              label="Bairro"
              value={formData.address.neighborhood}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="Cidade"
              value={formData.address.city}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="state"
              label="Estado"
              value={formData.address.state}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="zipCode"
              label="CEP"
              value={formData.address.zipCode}
              onChange={handleAddressChange}
              fullWidth
              required
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              inputProps={{
                maxLength: 8,
                pattern: '[0-9]*',
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={customer ? <EditIcon /> : <AddIcon />}
        >
          {customer ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm; 