import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Drawer,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  FilterList as FilterIcon,
  Event as EventIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import { mockResponse } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '../services/vehicleService';
import { useClients } from '../services/clientService';
import { Appointment } from '../types/Appointment';

// Mock appointments data
const fetchAppointments = async () => {
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Vehicle Maintenance',
      description: 'Regular maintenance for Toyota Corolla',
      startDate: '2023-05-15T10:00:00Z',
      endDate: '2023-05-15T12:00:00Z',
      type: 'maintenance',
      status: 'scheduled',
      vehicleId: '1',
      createdAt: '2023-05-10T08:30:00Z',
      updatedAt: '2023-05-10T08:30:00Z',
    },
    {
      id: '2',
      title: 'Client Meeting',
      description: 'Meeting with Sarah Williams about rental extension',
      startDate: '2023-05-16T14:30:00Z',
      endDate: '2023-05-16T15:30:00Z',
      type: 'client-meeting',
      status: 'scheduled',
      clientId: '3',
      createdAt: '2023-05-11T09:45:00Z',
      updatedAt: '2023-05-11T09:45:00Z',
    },
    {
      id: '3',
      title: 'Tesla Model 3 Rental',
      description: 'Vehicle rental for Michael Johnson',
      startDate: '2023-05-18T09:00:00Z',
      endDate: '2023-05-25T18:00:00Z',
      type: 'rental',
      status: 'scheduled',
      vehicleId: '3',
      clientId: '2',
      createdAt: '2023-05-12T11:20:00Z',
      updatedAt: '2023-05-12T11:20:00Z',
    },
    {
      id: '4',
      title: 'Honda CR-V Return',
      description: 'Vehicle return from Emily Davis',
      startDate: '2023-05-20T16:00:00Z',
      endDate: '2023-05-20T17:00:00Z',
      type: 'rental',
      status: 'scheduled',
      vehicleId: '2',
      clientId: '5',
      createdAt: '2023-05-13T14:10:00Z',
      updatedAt: '2023-05-13T14:10:00Z',
    },
    {
      id: '5',
      title: 'Ford F-150 Maintenance',
      description: 'Scheduled maintenance and oil change',
      startDate: '2023-05-22T11:00:00Z',
      endDate: '2023-05-22T14:00:00Z',
      type: 'maintenance',
      status: 'scheduled',
      vehicleId: '4',
      createdAt: '2023-05-14T10:30:00Z',
      updatedAt: '2023-05-14T10:30:00Z',
    },
  ];
  
  // Dynamically add appointments for current month
  const currentDate = new Date();
  const dynamicAppointments: Appointment[] = [];
  
  // Add some current month appointments
  for (let i = 1; i <= 5; i++) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      5 + i * 5,
      10,
      0,
      0
    );
    
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + (i % 3 === 0 ? 7 : 0), // Some multi-day events
      12,
      0,
      0
    );
    
    dynamicAppointments.push({
      id: `current-${i}`,
      title: i % 2 === 0 ? `Vehicle Rental #${i}` : `Maintenance #${i}`,
      description: `Automatically generated appointment #${i}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: i % 2 === 0 ? 'rental' : 'maintenance',
      status: 'scheduled',
      vehicleId: `${(i % 5) + 1}`,
      clientId: i % 2 === 0 ? `${(i % 5) + 1}` : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return mockResponse([...appointments, ...dynamicAppointments], 800);
};

// Event chip colors
const eventTypeColors: any = {
  maintenance: {
    bg: 'warning.main',
    text: 'warning.contrastText',
  },
  rental: {
    bg: 'primary.main',
    text: 'primary.contrastText',
  },
  'client-meeting': {
    bg: 'success.main',
    text: 'success.contrastText',
  },
  other: {
    bg: 'info.main',
    text: 'info.contrastText',
  },
};

const typeIcons = {
  maintenance: <BuildIcon />,
  rental: <CarIcon />,
  'client-meeting': <PersonIcon />,
  other: <EventIcon />,
};

interface CalendarCellProps {
  date: Date;
  appointments: Appointment[];
  currentMonth: Date;
  onAddAppointment: (date: Date) => void;
  onViewAppointment: (appointment: Appointment) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  appointments,
  currentMonth,
  onAddAppointment,
  onViewAppointment,
}) => {
  const theme: any = useTheme();
  const isToday = isSameDay(date, new Date());
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const formattedDate = format(date, 'd');
  
  // Filter appointments for this day
  const cellAppointments = appointments.filter((appointment) => {
    const start = parseISO(appointment.startDate);
    const end = parseISO(appointment.endDate);
    return isWithinInterval(date, { start, end });
  });
  
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 120,
        p: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isCurrentMonth ? 'background.paper' : alpha(theme.palette.action.disabledBackground, 0.3),
        color: !isCurrentMonth ? theme.palette.text.disabled : 'text.primary',
        position: 'relative',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? 'primary.main' : 'inherit',
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          }}
        >
          {formattedDate}
        </Typography>
        {isCurrentMonth && (
          <IconButton
            size="small"
            onClick={() => onAddAppointment(date)}
            sx={{ visibility: 'hidden', '.MuiBox-root:hover &': { visibility: 'visible' } }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 80, overflow: 'auto' }}>
        {cellAppointments.slice(0, 3).map((appointment) => (
          <Chip
            key={appointment.id}
            label={appointment.title}
            size="small"
            onClick={() => onViewAppointment(appointment)}
            sx={{
              bgcolor: theme.palette[eventTypeColors[appointment.type].bg],
              color: theme.palette[eventTypeColors[appointment.type].text],
              fontSize: '0.7rem',
              height: 20,
              width: '100%',
              justifyContent: 'flex-start',
              '& .MuiChip-label': {
                padding: '0 4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
        ))}
        {cellAppointments.length > 3 && (
          <Typography variant="caption" color="textSecondary" align="center">
            +{cellAppointments.length - 3} more
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const Calendar: React.FC = () => {
  const theme: any = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    type: 'other',
    vehicleId: '',
    clientId: '',
  });
  
  const { data: appointments = [], isLoading } = useQuery(
    ['appointments'], 
    fetchAppointments
  );
  
  const { data: vehicles = [] } = useVehicles();
  const { data: clients = [] } = useClients();
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  
  const handleAddAppointment = (date: Date) => {
    setAppointmentForm({
      ...appointmentForm,
      startDate: date,
      endDate: date,
    });
    setFormOpen(true);
  };
  
  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };
  
  const handleCloseForm = () => {
    setFormOpen(false);
  };
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedAppointment(null);
  };
  
  const handleSaveAppointment = () => {
    // In a real app, this would create a new appointment
    console.log('Save appointment:', appointmentForm);
    setFormOpen(false);
  };
  
  // Generate calendar days
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Add day headers
    const dayHeaders = [];
    for (let i = 0; i < 7; i++) {
      dayHeaders.push(
        <Box
          key={`header-${i}`}
          sx={{
            textAlign: 'center',
            py: 1,
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {format(addDays(startOfWeek(new Date()), i), 'EEE')}
        </Box>
      );
    }
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(
          <CalendarCell
            key={day.toString()}
            date={day}
            appointments={appointments}
            currentMonth={currentMonth}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={handleViewAppointment}
          />
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <Box
          key={day.toString()}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            flex: 1,
          }}
        >
          {days}
        </Box>
      );
      days = [];
    }
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
        >
          {dayHeaders}
        </Box>
        {rows}
      </Box>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Calendar
      </Typography>
      
      <Card sx={{ height: 'calc(100vh - 150px)' }}>
        <CardContent sx={{ height: '100%', p: '16px !important' }}>
          {/* Calendar header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mx: 2 }}>
                {format(currentMonth, 'MMMM yyyy')}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            
            <Box>
              <Button
                variant="outlined"
                startIcon={<TodayIcon />}
                onClick={handleToday}
                sx={{ mr: 1 }}
              >
                Today
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddAppointment(new Date())}
                sx={{ ml: 1 }}
              >
                New Event
              </Button>
            </Box>
          </Box>
          
          {/* Calendar grid */}
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100% - 50px)',
              }}
            >
              <Typography>Loading calendar...</Typography>
            </Box>
          ) : (
            renderCalendarDays()
          )}
        </CardContent>
      </Card>
      
      {/* New appointment form dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Add New Event</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                fullWidth
                value={appointmentForm.title}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={appointmentForm.description}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={appointmentForm.startDate}
                  onChange={(date) => setAppointmentForm({ ...appointmentForm, startDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={appointmentForm.endDate}
                  onChange={(date) => setAppointmentForm({ ...appointmentForm, endDate: date || new Date() })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={appointmentForm.type}
                  label="Event Type"
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value as any })}
                >
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="rental">Rental</MenuItem>
                  <MenuItem value="client-meeting">Client Meeting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle (Optional)</InputLabel>
                <Select
                  value={appointmentForm.vehicleId}
                  label="Vehicle (Optional)"
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicleId: e.target.value as string })}
                >
                  <MenuItem value="">None</MenuItem>
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Client (Optional)</InputLabel>
                <Select
                  value={appointmentForm.clientId}
                  label="Client (Optional)"
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, clientId: e.target.value as string })}
                >
                  <MenuItem value="">None</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSaveAppointment} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Appointment details drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            p: 3,
          },
        }}
      >
        {selectedAppointment && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Event Details</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                bgcolor: alpha(theme.palette[eventTypeColors[selectedAppointment.type].bg], 0.1),
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette[eventTypeColors[selectedAppointment.type].bg],
                    color: theme.palette[eventTypeColors[selectedAppointment.type].text],
                    mr: 2,
                  }}
                >
                  {typeIcons[selectedAppointment.type]}
                </Avatar>
                <Typography variant="h6">{selectedAppointment.title}</Typography>
              </Box>
              
              <Chip
                label={selectedAppointment.type.replace('-', ' ')}
                size="small"
                sx={{
                  bgcolor: theme.palette[eventTypeColors[selectedAppointment.type].bg],
                  color: theme.palette[eventTypeColors[selectedAppointment.type].text],
                }}
              />
            </Box>
            
            <Box mb={3}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2">{selectedAppointment.description || 'No description provided'}</Typography>
            </Box>
            
            <Box mb={3}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Date & Time
              </Typography>
              <Typography variant="body2">
                Start: {format(parseISO(selectedAppointment.startDate), 'PPP p')}
              </Typography>
              <Typography variant="body2">
                End: {format(parseISO(selectedAppointment.endDate), 'PPP p')}
              </Typography>
            </Box>
            
            {selectedAppointment.vehicleId && (
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Vehicle
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <CarIcon />
                  </Avatar>
                  <Typography>
                    {vehicles.find(v => v.id === selectedAppointment.vehicleId)
                      ? `${vehicles.find(v => v.id === selectedAppointment.vehicleId)?.make} ${vehicles.find(v => v.id === selectedAppointment.vehicleId)?.model}`
                      : 'Unknown Vehicle'}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {selectedAppointment.clientId && (
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Client
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography>
                    {clients.find(c => c.id === selectedAppointment.clientId)?.name || 'Unknown Client'}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
              >
                Edit
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Calendar;