import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { mockResponse } from './api';
import { Vehicle, VehicleFormData } from '../types/Vehicle';

// Mock data for development
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    licensePlate: 'ABC1234',
    color: 'Silver',
    status: 'available',
    fuelType: 'gasoline',
    mileage: 15000,
    dailyRate: 50,
    description: 'Well-maintained sedan, perfect for city driving.',
    features: ['Air Conditioning', 'Bluetooth', 'Backup Camera'],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY'
    },
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-02-20T14:15:00Z'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    licensePlate: 'XYZ7890',
    color: 'Blue',
    status: 'rented',
    fuelType: 'hybrid',
    mileage: 22000,
    dailyRate: 70,
    description: 'Spacious SUV with excellent fuel economy.',
    features: ['Navigation', 'Sunroof', 'Heated Seats', 'Apple CarPlay'],
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '456 Ocean Ave, Los Angeles, CA'
    },
    clientId: '3',
    createdAt: '2023-02-10T09:45:00Z',
    updatedAt: '2023-03-15T16:20:00Z'
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    licensePlate: 'EV5678',
    color: 'White',
    status: 'available',
    fuelType: 'electric',
    mileage: 8000,
    dailyRate: 95,
    description: 'Premium electric vehicle with autopilot features.',
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharger Access'],
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '789 Tech Blvd, San Francisco, CA'
    },
    createdAt: '2023-03-05T11:15:00Z',
    updatedAt: '2023-03-25T13:40:00Z'
  },
  {
    id: '4',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    licensePlate: 'TRK4321',
    color: 'Red',
    status: 'maintenance',
    fuelType: 'gasoline',
    mileage: 18500,
    dailyRate: 85,
    description: 'Powerful pickup truck for work or adventure.',
    features: ['Towing Package', '4x4', 'Bed Liner', 'Trailer Hitch'],
    location: {
      lat: 32.7767,
      lng: -96.7970,
      address: '321 Ranch Rd, Dallas, TX'
    },
    createdAt: '2023-01-20T08:30:00Z',
    updatedAt: '2023-04-05T10:10:00Z'
  },
  {
    id: '5',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    licensePlate: 'VWG1122',
    color: 'Black',
    status: 'available',
    fuelType: 'gasoline',
    mileage: 12000,
    dailyRate: 45,
    description: 'Compact hatchback with excellent handling.',
    features: ['Bluetooth', 'Backup Camera', 'Heated Mirrors'],
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '555 Lake St, Chicago, IL'
    },
    createdAt: '2023-02-25T13:20:00Z',
    updatedAt: '2023-03-30T15:45:00Z'
  }
];

// API functions
const fetchVehicles = async (): Promise<Vehicle[]> => {
  // In a real app: return (await api.get('/vehicles')).data;
  return mockResponse(mockVehicles, 800);
};

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  // In a real app: return (await api.get(`/vehicles/${id}`)).data;
  const vehicle = mockVehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return mockResponse(vehicle, 500);
};

const createVehicle = async (data: VehicleFormData): Promise<Vehicle> => {
  // In a real app: return (await api.post('/vehicles', data)).data;
  const newVehicle: Vehicle = {
    id: `new-${Date.now()}`,
    ...data,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(newVehicle, 1000);
};

const updateVehicle = async (id: string, data: Partial<VehicleFormData>): Promise<Vehicle> => {
  // In a real app: return (await api.put(`/vehicles/${id}`, data)).data;
  const vehicle = mockVehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  const updatedVehicle: Vehicle = {
    ...vehicle,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(updatedVehicle, 800);
};

const deleteVehicle = async (id: string): Promise<void> => {
  // In a real app: return (await api.delete(`/vehicles/${id}`)).data;
  return mockResponse(undefined, 600);
};

// React Query hooks
export const useVehicles = () => {
  return useQuery<Vehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });
};

export const useVehicle = (id: string) => {
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Vehicle, Error, VehicleFormData>({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Vehicle, Error, { id: string; data: Partial<VehicleFormData> }>({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};