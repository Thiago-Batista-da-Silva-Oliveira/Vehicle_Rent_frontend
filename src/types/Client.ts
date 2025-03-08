import { Rental } from "./Rental";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    documentId?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
    rentals?: Rental[];
  }
  
  export interface ClientFormData {
    name: string;
    email: string;
    phone: string;
    address?: string;
    documentId?: string;
  }
  