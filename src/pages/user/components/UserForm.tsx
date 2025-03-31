import React, { useEffect } from 'react';
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
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { User, CreateUserData, UpdateUserData } from '../../../services/userService';

type UserFormData = CreateUserData | UpdateUserData;

interface UserFormProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roleId: '',
      tenantId: '',
      active: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        roleId: user.roleId,
        tenantId: user.tenantId,
        active: user.active,
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        roleId: '',
        tenantId: '',
        active: true,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit({
      ...data,
      tenantId: 'a0a179d0-2bd4-4854-aba1-1cbd6cf9e9f3',
      roleId: '7b537e62-6346-4582-8790-0288dc8f81c6',
    });
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
            {!user && (
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter no mínimo 6 caracteres'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Senha"
                      type="password"
                      fullWidth
                      error={!!(errors as any).password}
                      helperText={(errors as any).password?.message}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name="roleId"
                control={control}
                rules={{ required: 'Função é obrigatória' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.roleId}>
                    <InputLabel>Função</InputLabel>
                    <Select
                      {...field}
                      label="Função"
                    >
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="manager">Gerente</MenuItem>
                      <MenuItem value="staff">Funcionário</MenuItem>
                    </Select>
                    {errors.roleId && (
                      <Typography color="error" variant="caption">
                        {errors.roleId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="tenantId"
                control={control}
                rules={{ required: 'Tenant é obrigatório' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tenantId}>
                    <InputLabel>Tenant</InputLabel>
                    <Select
                      {...field}
                      label="Tenant"
                    >
                      <MenuItem value="tenant-1">Tenant 1</MenuItem>
                      <MenuItem value="tenant-2">Tenant 2</MenuItem>
                      <MenuItem value="tenant-3">Tenant 3</MenuItem>
                    </Select>
                    {errors.tenantId && (
                      <Typography color="error" variant="caption">
                        {errors.tenantId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Ativo"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {user ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm; 