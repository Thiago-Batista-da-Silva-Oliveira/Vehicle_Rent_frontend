import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { mockResponse } from './api';
import { Vehicle, VehicleFormData } from '../types/Vehicle';
import useNotification from '../hooks/useNotification';

// Mock data for development
const mockVehicles: Vehicle[] = [];

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
    brand: apiVehicle.brand,
    model: apiVehicle.model,
    year: apiVehicle.year,
    plate: apiVehicle.plate,
    color: apiVehicle.color,
    status: apiVehicle.status.toLowerCase() as any,
    fuelType: mapFuelType(apiVehicle.fuelType),
    mileage: apiVehicle.mileage,
    createdAt: new Date(apiVehicle.createdAt),
    updatedAt: new Date(apiVehicle.updatedAt),
    categoryId: apiVehicle.categoryId,
    chassisNumber: apiVehicle.chassisNumber,
    purchaseDate: new Date(apiVehicle.purchaseDate),
    purchaseValue: apiVehicle.purchaseValue,
    renavamCode: apiVehicle.renavamCode,
    tenantId: '',
  };
};

export const mapVehicleToAPI = (vehicle: VehicleFormData): CreateVehicleRequest => {
  return {
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    chassisNumber: vehicle.chassisNumber,
    renavamCode: vehicle.renavamCode || '',
    fuelType: mapFuelTypeToAPI(vehicle.fuelType),
    mileage: vehicle.mileage,
    purchaseDate: vehicle.purchaseDate ? vehicle.purchaseDate.toISOString() : new Date().toISOString(),
    purchaseValue: vehicle.purchaseValue || 0,
    categoryId: vehicle.categoryId
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
      notification.showSuccess(`Veículo ${data.brand} ${data.model} criado com sucesso!`);
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
      notification.showSuccess(`Veículo ${data.brand} ${data.model} atualizado com sucesso!`);
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