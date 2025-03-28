import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { mockResponse } from './api';
import { Vehicle, VehicleFormData } from '../types/Vehicle';
import useNotification from '../hooks/useNotification';

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

// API interfaces based on api-routes.md
export interface VehicleApiResponse {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  chassisNumber: string;
  renavamCode: string;
  fuelType: 'FLEX' | 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  mileage: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RENTED' | 'INACTIVE';
  purchaseDate: string;
  purchaseValue: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  photos?: VehiclePhotoResponse[];
  category?: {
    id: string;
    name: string;
  };
}

export interface VehiclePhotoResponse {
  id: string;
  vehicleId: string;
  url: string;
  createdAt: string;
}

export interface CreateVehicleRequest {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  chassisNumber: string;
  renavamCode: string;
  fuelType: 'FLEX' | 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  mileage: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RENTED' | 'INACTIVE';
  purchaseDate: string;
  purchaseValue: number;
  categoryId: string;
}

export interface UpdateVehicleRequest {
  plate?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  chassisNumber?: string;
  renavamCode?: string;
  fuelType?: 'FLEX' | 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  mileage?: number;
  status?: 'AVAILABLE' | 'MAINTENANCE' | 'RENTED' | 'INACTIVE';
  purchaseDate?: string;
  purchaseValue?: number;
  categoryId?: string;
}

export interface GetVehiclesParams {
  categoryId?: string;
  status?: 'AVAILABLE' | 'MAINTENANCE' | 'RENTED' | 'INACTIVE';
}

// API functions
// Real API implementations
export const apiCreateVehicle = async (vehicle: CreateVehicleRequest): Promise<Vehicle> => {
  try {
    const response = await api.post<VehicleApiResponse>('/vehicles', vehicle);
    return mapVehicleFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao criar veículo');
  }
};

export const apiGetAllVehicles = async (params?: GetVehiclesParams): Promise<Vehicle[]> => {
  try {
    const response = await api.get<VehicleApiResponse[]>('/vehicles', { params });
    return response.data.map(mapVehicleFromAPI);
  } catch (error) {
    throw new Error('Falha ao buscar veículos');
  }
};

export const apiGetVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await api.get<VehicleApiResponse>(`/vehicles/${id}`);
    return mapVehicleFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao buscar veículo');
  }
};

export const apiUpdateVehicle = async (id: string, vehicle: UpdateVehicleRequest): Promise<Vehicle> => {
  try {
    const response = await api.put<VehicleApiResponse>(`/vehicles/${id}`, vehicle);
    return mapVehicleFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao atualizar veículo');
  }
};

export const apiDeleteVehicle = async (id: string): Promise<void> => {
  try {
    await api.delete(`/vehicles/${id}`);
  } catch (error) {
    throw new Error('Falha ao excluir veículo');
  }
};

export const apiUploadVehiclePhotos = async (id: string, photos: File[]): Promise<VehiclePhotoResponse[]> => {
  try {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    
    const response = await api.post<VehiclePhotoResponse[]>(`/vehicles/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Falha ao enviar fotos do veículo');
  }
};

// Mock API functions - for development without backend
const fetchVehicles = async (params?: GetVehiclesParams): Promise<Vehicle[]> => {
    return apiGetAllVehicles(params);
};

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  if (process.env.REACT_APP_USE_REAL_API === 'true') {
    return apiGetVehicleById(id);
  }
  const vehicle = mockVehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Veículo não encontrado');
  }
  return mockResponse(vehicle, 500);
};

const createVehicle = async (data: VehicleFormData): Promise<Vehicle> => {
    return apiCreateVehicle(mapVehicleToAPI(data));
};

const updateVehicle = async (id: string, data: Partial<VehicleFormData>): Promise<Vehicle> => {
    return apiUpdateVehicle(id, mapPartialVehicleToAPI(data));
};

const deleteVehicle = async (id: string): Promise<void> => {
  if (process.env.REACT_APP_USE_REAL_API === 'true') {
    return apiDeleteVehicle(id);
  }
  return mockResponse(undefined, 600);
};

const uploadVehiclePhotos = async (id: string, photos: File[]): Promise<VehiclePhotoResponse[]> => {
  if (process.env.REACT_APP_USE_REAL_API === 'true') {
    return apiUploadVehiclePhotos(id, photos);
  }
  // Mock implementation
  return mockResponse(
    photos.map((_, index) => ({
      id: `photo-${Date.now()}-${index}`,
      vehicleId: id,
      url: URL.createObjectURL(photos[index]),
      createdAt: new Date().toISOString()
    })),
    1000
  );
};

// Converters between frontend and API formats
export const mapVehicleFromAPI = (apiVehicle: VehicleApiResponse): Vehicle => {
  return {
    id: apiVehicle.id,
    make: apiVehicle.brand,
    model: apiVehicle.model,
    year: apiVehicle.year,
    licensePlate: apiVehicle.plate,
    color: apiVehicle.color,
    status: apiVehicle.status.toLowerCase() as any,
    fuelType: mapFuelType(apiVehicle.fuelType),
    mileage: apiVehicle.mileage,
    dailyRate: apiVehicle.purchaseValue / 1000, // Mock calculation, should be from a pricing model
    images: apiVehicle.photos?.map(photo => photo.url) || [],
    description: '',
    features: [],
    createdAt: apiVehicle.createdAt,
    updatedAt: apiVehicle.updatedAt
  };
};

export const mapVehicleToAPI = (vehicle: VehicleFormData): CreateVehicleRequest => {
  return {
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    chassisNumber: '', // These would need to be collected from the form
    renavamCode: '',
    fuelType: mapFuelTypeToAPI(vehicle.fuelType),
    mileage: vehicle.mileage,
    status: 'AVAILABLE',
    purchaseDate: new Date().toISOString(),
    categoryId: vehicle.categoryId,
    purchaseValue: vehicle.purchaseValue || 0,
  };
};

export const mapPartialVehicleToAPI = (vehicle: Partial<VehicleFormData>): UpdateVehicleRequest => {
  const mapped: UpdateVehicleRequest = {};
  
  if (vehicle.brand) mapped.brand = vehicle.brand;
  if (vehicle.model) mapped.model = vehicle.model;
  if (vehicle.year) mapped.year = vehicle.year;
  if (vehicle.plate) mapped.plate = vehicle.plate;
  if (vehicle.color) mapped.color = vehicle.color;
  if (vehicle.fuelType) mapped.fuelType = mapFuelTypeToAPI(vehicle.fuelType);
  if (vehicle.mileage) mapped.mileage = vehicle.mileage;
  
  return mapped;
};

// Helper functions for mapping enum values
const mapFuelType = (apiType: string): 'gasoline' | 'diesel' | 'electric' | 'hybrid' => {
  switch (apiType) {
    case 'FLEX':
    case 'GASOLINE':
      return 'gasoline';
    case 'DIESEL':
      return 'diesel';
    case 'ELECTRIC':
      return 'electric';
    case 'HYBRID':
      return 'hybrid';
    default:
      return 'gasoline';
  }
};

const mapFuelTypeToAPI = (type: string): 'FLEX' | 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' => {
  switch (type) {
    case 'gasoline':
      return 'GASOLINE';
    case 'diesel':
      return 'DIESEL';
    case 'electric':
      return 'ELECTRIC';
    case 'hybrid':
      return 'HYBRID';
    default:
      return 'FLEX';
  }
};

// React Query hooks
export const useVehicles = (params?: GetVehiclesParams) => {
  const notification = useNotification();
  
  return useQuery<Vehicle[], Error>({
    queryKey: ['vehicles', params],
    queryFn: () => fetchVehicles(params),
    onError: (error) => {
      notification.showError(`Erro ao carregar veículos: ${error.message}`);
    }
  });
};

export const useVehicle = (id: string) => {
  const notification = useNotification();
  
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
    onError: (error) => {
      notification.showError(`Erro ao carregar detalhes do veículo: ${error.message}`);
    }
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<Vehicle, Error, VehicleFormData>({
    mutationFn: createVehicle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      notification.showSuccess(`Veículo ${data.make} ${data.model} criado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao criar veículo: ${error.message}`);
    }
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<Vehicle, Error, { id: string; data: Partial<VehicleFormData> }>({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
      notification.showSuccess(`Veículo ${data.make} ${data.model} atualizado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao atualizar veículo: ${error.message}`);
    }
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      notification.showSuccess('Veículo excluído com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao excluir veículo: ${error.message}`);
    }
  });
};

export const useUploadVehiclePhotos = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<VehiclePhotoResponse[], Error, { id: string; photos: File[] }>({
    mutationFn: ({ id, photos }) => uploadVehiclePhotos(id, photos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
      notification.showSuccess('Fotos do veículo enviadas com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao enviar fotos: ${error.message}`);
    }
  });
};