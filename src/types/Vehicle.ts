export type VehicleStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  chassisNumber: string;
  renavamCode?: string;
  fuelType: string;
  mileage: number;
  status: string;
  purchaseDate?: Date;
  purchaseValue?: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  }
  
  export interface VehicleFormData {
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    chassisNumber: string;
    renavamCode?: string;
    fuelType: string;
    mileage: number;
    purchaseDate?: Date;
    purchaseValue?: number;
    categoryId: string;
    tenantId: string;
  }