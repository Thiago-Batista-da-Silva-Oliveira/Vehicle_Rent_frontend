export type CustomerType = 'INDIVIDUAL' | 'COMPANY';
export type DocumentType = 'CPF' | 'CNPJ';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  birthDate?: Date;
  type: CustomerType;
  address: Address;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  birthDate?: Date;
  type: CustomerType;
  address: Address;
  active: boolean;
  tenantId: string;
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  url: string;
  verified: boolean;
  verificationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCustomersParams {
  type?: CustomerType;
  rating?: number;
  active?: boolean;
  search?: string;
} 