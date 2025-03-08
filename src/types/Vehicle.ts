export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    status: 'available' | 'rented' | 'maintenance' | 'inactive';
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    mileage: number;
    dailyRate: number;
    images?: string[];
    description?: string;
    features?: string[];
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
    clientId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface VehicleFormData {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    mileage: number;
    dailyRate: number;
    images?: string[];
    description?: string;
    features?: string[];
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
  }