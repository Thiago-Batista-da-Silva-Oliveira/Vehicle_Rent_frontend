export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

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
  documentType: 'CPF' | 'CNPJ';
  type: CustomerType;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  type: CustomerType;
  address: Address;
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
  search?: string;
} 