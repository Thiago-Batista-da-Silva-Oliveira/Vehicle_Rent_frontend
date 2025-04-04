 
import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Grid,
  Divider,
  Typography,
  Paper,
  FormHelperText,
  FormControl,
  Checkbox,
  TextField,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Role } from '../routes/Roles';
import useAuthStore from '../../../store/authStore';
import { useGetRoleById } from '../../../services/rolesService';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
interface Permission {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const getPermissionSection = (permission: Permission) => {
  const parts = permission.slug.split(':');
  return parts.length === 2 ? parts[0] : 'other';
};

const groupPermissionsBySection = (permissions: Permission[]) => {
  const groups: Record<string, Permission[]> = {};
  
  permissions.forEach(permission => {
    const section = getPermissionSection(permission);
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(permission);
  });
  
  Object.keys(groups).forEach(section => {
    groups[section] = sortPermissionsByType(groups[section]);
  });
  
  return groups;
};

const sortPermissionsByType = (permissions: Permission[]) => {
  return [...permissions].sort((a, b) => {
    const aType = a.slug.split(':')[0] || '';
    const bType = b.slug.split(':')[0] || '';
    
    const typeOrder = { view: 1, create: 2, update: 3, delete: 4 };
    if (aType in typeOrder && bType in typeOrder) {
      return typeOrder[aType as keyof typeof typeOrder] - typeOrder[bType as keyof typeof typeOrder];
    }
    
    return a.name.localeCompare(b.name);
  });
};

const profileSchema = z.object({
  name: z.string().min(1, 'Nome do perfil é obrigatório'),
  description: z.string().min(1, 'Descrição do perfil é obrigatória'),
  permissionIds: z.array(z.string()).min(1, 'Selecione pelo menos uma funcionalidade')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  open: boolean;
  role?: Role;
  onClose: () => void;
  onSubmit: (data: ProfileFormValues) => void;
}

export default function ProfileForm({ open, role, onClose, onSubmit }: ProfileFormProps) {
  const { user } = useAuthStore();
  
  const permissions = user?.permissionsWithIds || [];
  const groupedPermissions = groupPermissionsBySection(permissions);
  
  const { data: selectedRole, isLoading: isLoadingRole } = useGetRoleById(role?.id || '');
  
  const [isViewMode, setIsViewMode] = useState(!!role?.id);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentRoleId, setCurrentRoleId] = useState<string | undefined>(role?.id);

  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    Object.keys(groupedPermissions).forEach(section => {
      initialExpandedState[section] = true;
    });
    setExpandedSections(initialExpandedState);
  }, []);

  const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: []
    }
  });

  useEffect(() => {
    if (selectedRole) {
      const permissionIds = selectedRole.permissions ? 
        selectedRole.permissions.map(permission => permission.id) : 
        [];

      reset({
        name: selectedRole.name,
        description: selectedRole.description,
        permissionIds: permissionIds
      });
      
      setIsViewMode(true);
      setCurrentRoleId(selectedRole.id);
    } else if (currentRoleId !== role?.id) {
      reset({
        name: '',
        description: '',
        permissionIds: []
      });
      setIsViewMode(false);
      setCurrentRoleId(role?.id);
    }
  }, [selectedRole, reset, role?.id]);

  const findRelatedPermissions = (resourceSection: string) => {
    return permissions.filter(p => {
      const parts = p.slug.split('.');
      return parts.length === 2 && parts[1] === resourceSection;
    });
  };

  const handlePermissionChange = useCallback((permission: Permission, isChecked: boolean) => {
    const currentPermissions = [...getValues('permissionIds')];
    const parts = permission.slug.split('.');
    
    if (parts.length !== 2) {
      let newPermissions = [...currentPermissions];
      
      if (isChecked && !newPermissions.includes(permission.id)) {
        newPermissions.push(permission.id);
      } else if (!isChecked && newPermissions.includes(permission.id)) {
        newPermissions = newPermissions.filter(id => id !== permission.id);
      }
      
      setValue('permissionIds', newPermissions, { shouldValidate: true });
      return;
    }
    
    const action = parts[0];
    const resource = parts[1];
    
    if (['create', 'update', 'delete'].includes(action) && isChecked) {
      const viewPermissionSlug = `view.${resource}`;
      const viewPermission = permissions.find(p => p.slug === viewPermissionSlug);
      
      const newPermissions = [...currentPermissions];
      
      if (!newPermissions.includes(permission.id)) {
        newPermissions.push(permission.id);
      }
      
      if (viewPermission && !newPermissions.includes(viewPermission.id)) {
        newPermissions.push(viewPermission.id);
      }
      
      setValue('permissionIds', newPermissions, { shouldValidate: true });
      
    } else if (action === 'view' && !isChecked) {
      const relatedPermissions = findRelatedPermissions(resource);
      
      const permissionsToRemove = relatedPermissions.map(p => p.id);
      const newPermissions = currentPermissions.filter(id => !permissionsToRemove.includes(id));
      
      setValue('permissionIds', newPermissions, { shouldValidate: true });
      
    } else {
      let newPermissions = [...currentPermissions];
      
      if (isChecked && !newPermissions.includes(permission.id)) {
        newPermissions.push(permission.id);
      } else if (!isChecked && newPermissions.includes(permission.id)) {
        newPermissions = newPermissions.filter(id => id !== permission.id);
      }
      
      setValue('permissionIds', newPermissions, { shouldValidate: true });
    }
  }, [getValues, setValue, permissions]);

  const handleSelectAllPermissions = (selectAll: boolean) => {
    if (selectAll) {
      const allPermissionIds = permissions.map(p => p.id);
      setValue('permissionIds', allPermissionIds, { shouldValidate: true });
    } else {
      setValue('permissionIds', [], { shouldValidate: true });
    }
  };

  const handleSelectSectionPermissions = (section: string, selectAll: boolean) => {
    const permissionsInSection = groupedPermissions[section] || [];
    const permissionIds = permissionsInSection.map(p => p.id);
    const currentPermissions = [...getValues('permissionIds')];
    
    let newPermissions = [...currentPermissions];
    
    if (selectAll) {
      const viewPermissions = permissionsInSection.filter(p => p.slug.startsWith('view.'));
      const otherPermissions = permissionsInSection.filter(p => !p.slug.startsWith('view.'));
      
      viewPermissions.forEach(p => {
        if (!newPermissions.includes(p.id)) {
          newPermissions.push(p.id);
        }
      });
      
      otherPermissions.forEach(p => {
        if (!newPermissions.includes(p.id)) {
          newPermissions.push(p.id);
        }
      });
    } else {
      newPermissions = currentPermissions.filter(id => !permissionIds.includes(id));
    }
    
    setValue('permissionIds', newPermissions, { shouldValidate: true });
  };

  const areAllPermissionsSelected = () => {
    const currentPermissions = getValues('permissionIds');
    return permissions.length > 0 && 
           currentPermissions.length === permissions.length;
  };

  const areSomePermissionsSelected = () => {
    const currentPermissions = getValues('permissionIds');
    return currentPermissions.length > 0 && 
           currentPermissions.length < permissions.length;
  };

  const areSectionPermissionsSelected = (section: string) => {
    const permissionsInSection = groupedPermissions[section] || [];
    if (permissionsInSection.length === 0) return false;
    
    const permissionIds = permissionsInSection.map(p => p.id);
    const currentPermissions = getValues('permissionIds');
    
    return permissionIds.every(id => currentPermissions.includes(id));
  };

  const areSomeSectionPermissionsSelected = (section: string) => {
    const permissionsInSection = groupedPermissions[section] || [];
    if (permissionsInSection.length === 0) return false;
    
    const permissionIds = permissionsInSection.map(p => p.id);
    const currentPermissions = getValues('permissionIds');
    
    const hasAny = permissionIds.some(id => currentPermissions.includes(id));
    const hasAll = permissionIds.every(id => currentPermissions.includes(id));
    
    return hasAny && !hasAll;
  };

  const toggleSectionExpansion = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPermissionType = (permission: Permission) => {
    const parts = permission.slug.split('.');
    if (parts.length !== 2) return 'Outros';
    
    const action = parts[0];
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const handleFormSubmit = (data: ProfileFormValues) => {
    onSubmit(data);
    onClose();
    reset();
  };

  if (isLoadingRole && role?.id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
        <DialogTitle>
            {role ? 'Editar Perfil' : 'Criar Perfil'}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
    <DialogContent>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2">
              Formulário de Cadastro de Perfil
            </Typography>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dados do Perfil
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome do Perfil"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isViewMode}
                    margin="normal"
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
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isViewMode}
                    margin="normal"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Funcionalidades do Sistema
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isViewMode && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areAllPermissionsSelected()}
                        indeterminate={areSomePermissionsSelected() && !areAllPermissionsSelected()}
                        onChange={(e) => handleSelectAllPermissions(e.target.checked)}
                        disabled={isViewMode}
                      />
                    }
                    label="Selecionar Todos"
                  />
                </>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Controller
            name="permissionIds"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.permissionIds}>
                {Object.keys(groupedPermissions).map((section) => (
                  <Accordion 
                    key={section}
                    expanded={expandedSections[section] || false}
                    onChange={() => toggleSectionExpansion(section)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${section}-content`}
                      id={`panel-${section}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        {!isViewMode && (
                          <Checkbox
                            checked={areSectionPermissionsSelected(section)}
                            indeterminate={areSomeSectionPermissionsSelected(section)}
                            onChange={(e) => handleSelectSectionPermissions(section, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="subtitle1">
                          {capitalize(section)}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox" width="5%">
                                {!isViewMode && (
                                  <Checkbox 
                                    checked={areSectionPermissionsSelected(section)}
                                    indeterminate={areSomeSectionPermissionsSelected(section)}
                                    onChange={(e) => handleSelectSectionPermissions(section, e.target.checked)}
                                    disabled={isViewMode}
                                  />
                                )}
                              </TableCell>
                              <TableCell width="30%">Funcionalidade</TableCell>
                              <TableCell width="50%">Descrição</TableCell>
                              <TableCell width="15%">Tipo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {groupedPermissions[section]?.map((permission) => {
                              // Verificar se a permissão está nos valores selecionados pelo ID
                              const isSelected = field.value.includes(permission.id);
                              
                              return (
                                <TableRow 
                                  key={permission.id}
                                  hover
                                  onClick={() => {
                                    if (isViewMode) return;
                                    const isChecked = !isSelected;
                                    handlePermissionChange(permission, isChecked);
                                  }}
                                  selected={isSelected}
                                  sx={{ cursor: isViewMode ? 'default' : 'pointer' }}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox 
                                      checked={isSelected}
                                      disabled={isViewMode}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        if (isViewMode) return;
                                        handlePermissionChange(permission, e.target.checked);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>{permission.name}</TableCell>
                                  <TableCell>{permission.description}</TableCell>
                                  <TableCell>{getPermissionType(permission)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
                {errors.permissionIds && (
                  <FormHelperText>{errors.permissionIds.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Paper>
      </Paper>
    </DialogContent>
    </form>
    <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit"
            variant="contained"
            startIcon={role ? <EditIcon /> : <AddIcon />}
          >
            {role ? 'Atualizar Perfil' : 'Criar Perfil'}
          </Button>
        </DialogActions>
    </Dialog>
  );
}