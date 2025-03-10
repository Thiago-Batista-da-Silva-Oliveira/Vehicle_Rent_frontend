import {
    Box,
    Typography,
    Button,
    Card,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Tooltip,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
    ListItemIcon,
    ListItemText,
    Switch,
    FormControlLabel,
    useTheme,
    alpha,
    Tab,
    Tabs,
    FormGroup,
  } from '@mui/material';
  import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Lock as LockIcon,
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    ManageAccounts as ManageAccountsIcon,
    Check as CheckIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Block as BlockIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
  } from '@mui/icons-material';
  import { useQuery, useQueryClient } from '@tanstack/react-query';
  import { formatDate } from '../../utils/formatters';
import { useEffect, useState } from 'react';
import { User, UserFormData, useUsers } from '../../services/systemUsers';

// Role icons and colors
const roleIcons = {
  'admin': <AdminIcon />,
  'manager': <ManageAccountsIcon />,
  'staff': <PersonIcon />,
};

const roleColors = {
  'admin': '#8E44AD', // Purple
  'manager': '#2E86C1', // Blue
  'staff': '#16A085', // Green
};

const statusColors = {
  'active': 'success',
  'inactive': 'warning',
  'locked': 'error',
};
  
// User List component
const UsersList: React.FC<{
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, newStatus: User['status']) => void;
}> = ({ onEdit, onDelete, onStatusChange }) => {
  const theme = useTheme();
  const { data: users = [], isLoading } = useUsers();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleEdit = () => {
    if (selectedUser) {
      onEdit(selectedUser);
      handleCloseMenu();
    }
  };
  
  const handleDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser.id);
      handleCloseMenu();
    }
  };
  
  const handleToggleStatus = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
      onStatusChange(selectedUser.id, newStatus);
      handleCloseMenu();
    }
  };
  
  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const sortedUsers = filteredUsers.sort((a, b) => {
    let aValue: any = a[sortField as keyof User];
    let bValue: any = b[sortField as keyof User];
    
    // Convert dates to timestamps for comparison
    if (typeof aValue === 'string' && (sortField === 'lastLogin' || sortField === 'createdAt' || sortField === 'updatedAt')) {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue as string).getTime() : 0;
    }
    
    // Convert strings to lowercase for case-insensitive comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue === bValue) {
      return 0;
    }
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    // Compare values based on sort direction
    return (
      (sortDirection === 'asc' ? 1 : -1) *
      (aValue < bValue ? -1 : 1)
    );
  });
  
  // Paginate users
  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // SortIcon component
  const SortIcon = ({ field }: { field: string }) => (
    sortField === field ? (
      sortDirection === 'asc' ? (
        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', opacity: 0.8 }} />
      ) : (
        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle', opacity: 0.8 }} />
      )
    ) : null
  );
  
  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Search and filters */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, minWidth: { sm: '400px' } }}>
          <FormControl variant="outlined" fullWidth size="medium">
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth size="medium">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="locked">Locked</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Users table */}
      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[2] }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('name')} 
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  User
                  <SortIcon field="name" />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('role')} 
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Role
                  <SortIcon field="role" />
                </Box>
              </TableCell>
              <TableCell>Contact</TableCell>
              <TableCell 
                onClick={() => handleSort('status')} 
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status
                  <SortIcon field="status" />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('lastLogin')} 
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Last Login
                  <SortIcon field="lastLogin" />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('createdAt')} 
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Created
                  <SortIcon field="createdAt" />
                </Box>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    No users found. Try adjusting your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{
                          mr: 2,
                          bgcolor: user.avatar ? 'transparent' : roleColors[user.role],
                        }}
                      >
                        {!user.avatar && user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={roleIcons[user.role]}
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      sx={{
                        backgroundColor: alpha(roleColors[user.role], 0.1),
                        color: roleColors[user.role],
                        fontWeight: 'medium',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                      {user.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">{user.phone}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      color={statusColors[user.status] as 'success' | 'warning' | 'error'}
                      size="small"
                      icon={
                        user.status === 'active' ? <CheckIcon /> :
                        user.status === 'locked' ? <LockIcon /> :
                        <BlockIcon />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <Typography variant="body2">
                        {formatDate(user.lastLogin)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, user)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 2,
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedUser?.status === 'active' ? (
              <BlockIcon fontSize="small" color="warning" />
            ) : (
              <CheckIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status === 'active' ? 'Deactivate User' : 'Activate User'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// User form component
const UserForm: React.FC<{
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
}> = ({ open, user, onClose, onSubmit }) => {
  const initialFormData: UserFormData = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'staff',
    phone: user?.phone || '',
    status: user?.status || 'active',
    password: '',
    confirmPassword: '',
    avatar: user?.avatar || '',
    permissions: user?.permissions || [],
  };
  
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error for the field being changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate password for new users
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Password is required for new users';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
      setShowPassword(false);
    }
  }, [open, user]);
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {user ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Full Name"
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
              label="Email Address"
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
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="locked">Locked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="avatar"
              label="Avatar URL (Optional)"
              value={formData.avatar}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label={user ? "New Password (leave blank to keep current)" : "Password"}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required={!user}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required={!user || !!formData.password}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Permissions
            </Typography>
            <FormGroup>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('users.view')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'users.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'users.view')
                            }));
                          }
                        }}
                      />
                    }
                    label="View Users"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('users.manage')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'users.manage', 'users.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'users.manage')
                            }));
                          }
                        }}
                      />
                    }
                    label="Manage Users"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('vehicles.view')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'vehicles.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'vehicles.view')
                            }));
                          }
                        }}
                      />
                    }
                    label="View Vehicles"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('vehicles.manage')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'vehicles.manage', 'vehicles.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'vehicles.manage')
                            }));
                          }
                        }}
                      />
                    }
                    label="Manage Vehicles"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('clients.view')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'clients.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'clients.view')
                            }));
                          }
                        }}
                      />
                    }
                    label="View Clients"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('clients.manage')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'clients.manage', 'clients.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'clients.manage')
                            }));
                          }
                        }}
                      />
                    }
                    label="Manage Clients"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('financial.view')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'financial.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'financial.view')
                            }));
                          }
                        }}
                      />
                    }
                    label="View Financial Data"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('financial.manage')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'financial.manage', 'financial.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'financial.manage')
                            }));
                          }
                        }}
                      />
                    }
                    label="Manage Financial Data"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('settings.manage')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'settings.manage']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'settings.manage')
                            }));
                          }
                        }}
                      />
                    }
                    label="Manage Settings"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('reports.view')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(prev.permissions || []), 'reports.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'reports.view')
                            }));
                          }
                        }}
                      />
                    }
                    label="View Reports"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions?.includes('all')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: ['all', 'users.view', 'users.manage', 'vehicles.view', 'vehicles.manage', 
                                'clients.view', 'clients.manage', 'financial.view', 'financial.manage', 
                                'settings.manage', 'reports.view']
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (prev.permissions || []).filter(p => p !== 'all')
                            }));
                          }
                        }}
                      />
                    }
                    label="All Permissions (Admin)"
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {user ? 'Update User' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main UsersPage component
const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        // In a real app, call an API to delete the user
        console.log(`Deleting user ${userToDelete}`);
        
        // Mock update the cache
        queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(user => user.id !== userToDelete);
        });
        
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  const handleUserStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      // In a real app, call an API to update the status
      console.log(`Changing user ${userId} status to ${newStatus}`);
      
      // Mock update the cache
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(user => user.id === userId ? { ...user, status: newStatus } : user);
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  const handleUserFormSubmit = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        // Update existing user
        console.log('Updating user:', data);
        
        // Mock update the cache
        queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
          if (!oldData) return [];
          return oldData.map(user => {
            if (user.id === selectedUser.id) {
              return {
                ...user,
                name: data.name,
                email: data.email,
                role: data.role,
                phone: data.phone,
                status: data.status,
                avatar: data.avatar,
                permissions: data.permissions || [],
                updatedAt: new Date().toISOString(),
              };
            }
            return user;
          });
        });
      } else {
        // Create new user
        console.log('Creating user:', data);
        
        // Mock update the cache
        const newUser: User = {
          id: `new-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          status: data.status,
          avatar: data.avatar,
          permissions: data.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
          if (!oldData) return [newUser];
          return [...oldData, newUser];
        });
      }
      
      setUserFormOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Users" />
          <Tab label="Admins" />
          <Tab label="Managers" />
          <Tab label="Staff" />
        </Tabs>
      </Card>
      
      <UsersList
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onStatusChange={handleUserStatusChange}
      />
      
      <UserForm
        open={userFormOpen}
        user={selectedUser}
        onClose={() => setUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
      />
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;