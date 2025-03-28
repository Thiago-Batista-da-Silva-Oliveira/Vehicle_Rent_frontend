import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  LocationOn as LocationIcon,
  Navigation as NavigationIcon,
  FilterList as FilterIcon,
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from '../../../types/Vehicle';
import { useVehicles } from '../../../services/vehicleService';


// Fix Leaflet marker issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Status colors
const statusColors = {
  available: '#4ade80', // green
  rented: '#3a86ff', // blue
  maintenance: '#f59e0b', // orange
  inactive: '#ef4444', // red
};

// Map controls component
const MapControls: React.FC = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.setView(
          [position.coords.latitude, position.coords.longitude],
          13
        );
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <IconButton
        onClick={handleZoomIn}
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
      >
        <ZoomInIcon />
      </IconButton>
      <IconButton
        onClick={handleZoomOut}
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
      >
        <ZoomOutIcon />
      </IconButton>
      <IconButton
        onClick={handleMyLocation}
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
      >
        <MyLocationIcon />
      </IconButton>
      <IconButton
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
      >
        <LayersIcon />
      </IconButton>
    </Box>
  );
};

const Map: React.FC = () => {
  const theme = useTheme();
  const { data: vehicles, isLoading } = useVehicles();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Default map center (New York)
  const defaultCenter: [number, number] = [40.7128, -74.0060];

  const filteredVehicles = vehicles
    ? vehicles.filter(
        (vehicle) =>
          (statusFilter === 'all' || vehicle.status === statusFilter) &&
          (search === '' ||
            vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.licensePlate.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // In a real app, you would center the map on the selected vehicle
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Vehicle Tracking
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
        {/* Sidebar */}
        <Card
          sx={{
            width: 320,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
          }}
        >
          <CardContent sx={{ p: 2, flexGrow: 0 }}>
            <TextField
              fullWidth
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="maintenance">In Maintenance</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </CardContent>

          <Divider />

          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <List disablePadding>
                {filteredVehicles.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="textSecondary">
                        Nenhum veículo encontrado
                    </Typography>
                  </Box>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <React.Fragment key={vehicle.id}>
                      <ListItem
                        button
                        selected={selectedVehicle?.id === vehicle.id}
                        onClick={() => handleVehicleSelect(vehicle)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: statusColors[vehicle.status] }}>
                            <CarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${vehicle.make} ${vehicle.model}`}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                {vehicle.licensePlate}
                              </Typography>
                              <br />
                              <Chip
                                label={vehicle.status}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: statusColors[vehicle.status],
                                  color: 'white',
                                  mt: 0.5,
                                }}
                              />
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleVehicleSelect(vehicle)}
                          >
                            <NavigationIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>
            )}
          </Box>
          
          {selectedVehicle && (
            <>
              <Divider />
              <CardContent sx={{ p: 2, flexGrow: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Vehicle
                </Typography>
                <Typography variant="body2">
                  <strong>Model:</strong> {selectedVehicle.make} {selectedVehicle.model}
                </Typography>
                <Typography variant="body2">
                  <strong>Plate:</strong> {selectedVehicle.licensePlate}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedVehicle.status}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CarIcon />}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  View Details
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        {/* Map container */}
        <Card sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', position: 'relative' }}>
            {!isLoading ? (
              <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filteredVehicles.map((vehicle) => (
                  vehicle.location && (
                    <Marker
                      key={vehicle.id}
                      position={[vehicle.location.lat, vehicle.location.lng]}
                      icon={createMarkerIcon(statusColors[vehicle.status])}
                    >
                      <Popup>
                        <div>
                          <Typography variant="subtitle2">
                            {vehicle.make} {vehicle.model}
                          </Typography>
                          <Typography variant="body2">
                            License Plate: {vehicle.licensePlate}
                          </Typography>
                          <Typography variant="body2">
                            Status: {vehicle.status}
                          </Typography>
                          {vehicle.location.address && (
                            <Typography variant="body2">
                              Address: {vehicle.location.address}
                            </Typography>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
                
                <MapControls />
              </MapContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Map;