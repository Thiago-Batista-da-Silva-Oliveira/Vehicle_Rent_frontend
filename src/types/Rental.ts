import { Client } from "./Client";
import { Vehicle } from "./Vehicle";

export interface Rental {
    id: string;
    vehicleId: string;
    clientId: string;
    startDate: string;
    endDate: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    totalPrice: number;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    // Populated fields
    vehicle?: Vehicle;
    client?: Client;
  }
  
  export interface RentalFormData {
    vehicleId: string;
    clientId: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }