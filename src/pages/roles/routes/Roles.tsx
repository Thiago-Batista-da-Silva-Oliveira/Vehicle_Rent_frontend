import {
  Box,
  Button,
  Card,
  Tab,
  Tabs,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import RolesList from '../components/RolesList';
import { useState } from 'react';
interface CreateRoleRequest {
  name: string;
  description: string;
  companyId: string;
  permissions: string[];
}

interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  companyId?: string;
  permissions?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  companyId: string;
  permissions: {
    id: string;
    name: string;
    slug: string;
    description: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}


export default function RolesPage() {
  const isLoading = false;
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEditRole = (role: Role) => { 
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" component="h1">
          Perfis
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {}}
        >
          Novo Perfil
        </Button>
      </Box>
      <Card sx={{ mb: 3 }}>
      <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary"
          textColor="primary"
          variant="fullWidth">
          <Tab label="Ativos" />
          <Tab label="Inativos" />
        </Tabs>
      </Card>
      <RolesList
        roles={filteredRoles}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />
    </Box>
  );
}