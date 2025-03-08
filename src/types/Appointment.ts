import { Client } from "./Client";
import { Vehicle } from "./Vehicle";

export interface Appointment {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    type: 'maintenance' | 'rental' | 'client-meeting' | 'other';
    status: 'scheduled' | 'completed' | 'cancelled';
    vehicleId?: string;
    clientId?: string;
    createdAt: string;
    updatedAt: string;
    // Populated fields
    vehicle?: Vehicle;
    client?: Client;
  }
  
  export interface AppointmentFormData {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    type: 'maintenance' | 'rental' | 'client-meeting' | 'other';
    vehicleId?: string;
    clientId?: string;
  }