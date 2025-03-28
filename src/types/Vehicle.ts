export type VehicleStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    status: string;
    fuelType: FuelType;
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
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface VehicleFormData {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    fuelType: FuelType;
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