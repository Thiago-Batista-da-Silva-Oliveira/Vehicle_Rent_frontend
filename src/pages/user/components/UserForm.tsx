import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import { User, CreateUserData, UpdateUserData } from '../../../services/userService';

interface UserFormProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserData | UpdateUserData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roleId: user?.roleId || '',
    tenantId: user?.tenantId || '',
    active: user?.active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.roleId) newErrors.roleId = 'Função é obrigatória';
    if (!formData.tenantId) newErrors.tenantId = 'Tenant é obrigatório';
    if (!user && !(formData as CreateUserData).password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Nome"
              value={formData.name}
              onChange={handleTextChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleTextChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {!user && (
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Senha"
                type="password"
                value={(formData as CreateUserData).password}
                onChange={handleTextChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.roleId}>
              <InputLabel>Função</InputLabel>
              <Select
                name="roleId"
                value={formData.roleId}
                onChange={handleSelectChange}
                label="Função"
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="manager">Gerente</MenuItem>
                <MenuItem value="staff">Funcionário</MenuItem>
              </Select>
              {errors.roleId && (
                <Typography color="error" variant="caption">
                  {errors.roleId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.tenantId}>
              <InputLabel>Tenant</InputLabel>
              <Select
                name="tenantId"
                value={formData.tenantId}
                onChange={handleSelectChange}
                label="Tenant"
              >
                <MenuItem value="tenant-1">Tenant 1</MenuItem>
                <MenuItem value="tenant-2">Tenant 2</MenuItem>
                <MenuItem value="tenant-3">Tenant 3</MenuItem>
              </Select>
              {errors.tenantId && (
                <Typography color="error" variant="caption">
                  {errors.tenantId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                />
              }
              label="Ativo"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {user ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm; 