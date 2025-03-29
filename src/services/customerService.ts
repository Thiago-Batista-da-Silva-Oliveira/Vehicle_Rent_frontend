import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { Customer, CustomerFormData, CustomerDocument, GetCustomersParams } from '../types/Customer';
import useNotification from '../hooks/useNotification';

// API interfaces
export interface CustomerApiResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cnpj?: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocumentApiResponse {
  id: string;
  customerId: string;
  url: string;
  verified: boolean;
  verificationNote?: string;
  createdAt: string;
  updatedAt: string;
}

// API functions
const apiCreateCustomer = async (customer: CustomerFormData): Promise<Customer> => {
  try {
    const apiData = mapCustomerToAPI(customer);
    const response = await api.post<CustomerApiResponse>('/customers', apiData);
    return mapCustomerFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao criar cliente');
  }
};

const apiGetAllCustomers = async (params?: GetCustomersParams): Promise<Customer[]> => {
  try {
    const response = await api.get<CustomerApiResponse[]>('/customers', { params });
    return response.data.map(mapCustomerFromAPI);
  } catch (error) {
    throw new Error('Falha ao buscar clientes');
  }
};

const apiGetCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await api.get<CustomerApiResponse>(`/customers/${id}`);
    return mapCustomerFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao buscar cliente');
  }
};

const apiUpdateCustomer = async (id: string, customer: Partial<CustomerFormData>): Promise<Customer> => {
  try {
    const apiData = mapCustomerToAPI(customer as CustomerFormData);
    const response = await api.put<CustomerApiResponse>(`/customers/${id}`, apiData);
    return mapCustomerFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao atualizar cliente');
  }
};

const apiDeleteCustomer = async (id: string): Promise<void> => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    throw new Error('Falha ao excluir cliente');
  }
};

const apiUploadCustomerDocument = async (customerId: string, document: File): Promise<CustomerDocument> => {
  try {
    const formData = new FormData();
    formData.append('document', document);
    
    const response = await api.post<CustomerDocumentApiResponse>(
      `/customers/${customerId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return mapCustomerDocumentFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao enviar documento do cliente');
  }
};

const apiGetCustomerDocuments = async (customerId: string): Promise<CustomerDocument[]> => {
  try {
    const response = await api.get<CustomerDocumentApiResponse[]>(`/customers/${customerId}/documents`);
    return response.data.map(mapCustomerDocumentFromAPI);
  } catch (error) {
    throw new Error('Falha ao buscar documentos do cliente');
  }
};

const apiVerifyCustomerDocument = async (
  customerId: string,
  documentId: string,
  verified: boolean,
  verificationNote?: string
): Promise<CustomerDocument> => {
  try {
    const response = await api.put<CustomerDocumentApiResponse>(
      `/customers/${customerId}/documents/${documentId}/verify`,
      { verified, verificationNote }
    );
    return mapCustomerDocumentFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao verificar documento do cliente');
  }
};

const apiDeleteCustomerDocument = async (customerId: string, documentId: string): Promise<void> => {
  try {
    await api.delete(`/customers/${customerId}/documents/${documentId}`);
  } catch (error) {
    throw new Error('Falha ao excluir documento do cliente');
  }
};

// Converters between frontend and API formats
const mapCustomerFromAPI = (apiCustomer: CustomerApiResponse): Customer => {
  return {
    id: apiCustomer.id,
    name: apiCustomer.name,
    email: apiCustomer.email,
    phone: apiCustomer.phone,
    document: apiCustomer.cpf || apiCustomer.cnpj || '',
    documentType: apiCustomer.cpf ? 'CPF' : 'CNPJ',
    type: apiCustomer.type,
    address: apiCustomer.address,
    createdAt: new Date(apiCustomer.createdAt),
    updatedAt: new Date(apiCustomer.updatedAt),
  };
};

const mapCustomerToAPI = (customer: CustomerFormData): any => {
  const baseData = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    type: customer.type,
    address: customer.address,
  };

  if (customer.type === 'INDIVIDUAL') {
    return {
      ...baseData,
      cpf: customer.document,
    };
  }

  return {
    ...baseData,
    cnpj: customer.document,
  };
};

const mapCustomerDocumentFromAPI = (apiDocument: CustomerDocumentApiResponse): CustomerDocument => {
  return {
    id: apiDocument.id,
    customerId: apiDocument.customerId,
    url: apiDocument.url,
    verified: apiDocument.verified,
    verificationNote: apiDocument.verificationNote,
    createdAt: new Date(apiDocument.createdAt),
    updatedAt: new Date(apiDocument.updatedAt),
  };
};

// React Query hooks
export const useCustomers = (params?: GetCustomersParams) => {
  const notification = useNotification();
  
  return useQuery<Customer[], Error>({
    queryKey: ['customers', params],
    queryFn: () => apiGetAllCustomers(params),
    onError: (error) => {
      notification.showError(`Erro ao carregar clientes: ${error.message}`);
    }
  });
};

export const useCustomer = (id: string) => {
  const notification = useNotification();
  
  return useQuery<Customer, Error>({
    queryKey: ['customer', id],
    queryFn: () => apiGetCustomerById(id),
    enabled: !!id,
    onError: (error) => {
      notification.showError(`Erro ao carregar detalhes do cliente: ${error.message}`);
    }
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<Customer, Error, CustomerFormData>({
    mutationFn: apiCreateCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      notification.showSuccess(`Cliente ${data.name} criado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao criar cliente: ${error.message}`);
    }
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<Customer, Error, { id: string; data: Partial<CustomerFormData> }>({
    mutationFn: ({ id, data }) => apiUpdateCustomer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
      notification.showSuccess(`Cliente ${data.name} atualizado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao atualizar cliente: ${error.message}`);
    }
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<void, Error, string>({
    mutationFn: apiDeleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      notification.showSuccess('Cliente excluído com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao excluir cliente: ${error.message}`);
    }
  });
};

export const useCustomerDocuments = (customerId: string) => {
  const notification = useNotification();
  
  return useQuery<CustomerDocument[], Error>({
    queryKey: ['customer-documents', customerId],
    queryFn: () => apiGetCustomerDocuments(customerId),
    enabled: !!customerId,
    onError: (error) => {
      notification.showError(`Erro ao carregar documentos do cliente: ${error.message}`);
    }
  });
};

export const useUploadCustomerDocument = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<CustomerDocument, Error, { customerId: string; document: File }>({
    mutationFn: ({ customerId, document }) => apiUploadCustomerDocument(customerId, document),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-documents', variables.customerId] });
      notification.showSuccess('Documento do cliente enviado com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao enviar documento: ${error.message}`);
    }
  });
};

export const useVerifyCustomerDocument = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<
    CustomerDocument,
    Error,
    { customerId: string; documentId: string; verified: boolean; verificationNote?: string }
  >({
    mutationFn: ({ customerId, documentId, verified, verificationNote }) =>
      apiVerifyCustomerDocument(customerId, documentId, verified, verificationNote),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-documents', variables.customerId] });
      notification.showSuccess('Documento verificado com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao verificar documento: ${error.message}`);
    }
  });
};

export const useDeleteCustomerDocument = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  
  return useMutation<void, Error, { customerId: string; documentId: string }>({
    mutationFn: ({ customerId, documentId }) => apiDeleteCustomerDocument(customerId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-documents', variables.customerId] });
      notification.showSuccess('Documento excluído com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao excluir documento: ${error.message}`);
    }
  });
}; 