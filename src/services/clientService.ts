import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockResponse } from './api';
import { Client, ClientFormData } from '../types/Client';

// Mock data for development
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Boston, MA 02108',
    documentId: 'DL-98765432',
    status: 'active',
    createdAt: '2023-01-10T08:30:00Z',
    updatedAt: '2023-02-15T14:20:00Z',
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, San Francisco, CA 94107',
    documentId: 'DL-12345678',
    status: 'active',
    createdAt: '2023-02-05T10:15:00Z',
    updatedAt: '2023-03-20T16:45:00Z',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine St, Seattle, WA 98101',
    documentId: 'DL-56789012',
    status: 'active',
    createdAt: '2023-01-25T09:45:00Z',
    updatedAt: '2023-02-28T11:30:00Z',
  },
  {
    id: '4',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '(555) 234-5678',
    status: 'inactive',
    createdAt: '2022-12-15T14:20:00Z',
    updatedAt: '2023-03-10T13:15:00Z',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 876-5432',
    address: '321 Cedar Rd, Austin, TX 78701',
    documentId: 'DL-34567890',
    status: 'active',
    createdAt: '2023-03-01T11:10:00Z',
    updatedAt: '2023-03-25T15:40:00Z',
  }
];

// API functions
const fetchClients = async (): Promise<Client[]> => {
  // In a real app: return (await api.get('/clients')).data;
  return mockResponse(mockClients, 800);
};

const fetchClientById = async (id: string): Promise<Client> => {
  // In a real app: return (await api.get(`/clients/${id}`)).data;
  const client = mockClients.find(c => c.id === id);
  if (!client) {
    throw new Error('Client not found');
  }
  return mockResponse(client, 500);
};

const createClient = async (data: ClientFormData): Promise<Client> => {
  // In a real app: return (await api.post('/clients', data)).data;
  const newClient: Client = {
    id: `new-${Date.now()}`,
    ...data,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(newClient, 1000);
};

const updateClient = async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
  // In a real app: return (await api.put(`/clients/${id}`, data)).data;
  const client = mockClients.find(c => c.id === id);
  if (!client) {
    throw new Error('Client not found');
  }
  const updatedClient: Client = {
    ...client,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(updatedClient, 800);
};

const deleteClient = async (id: string): Promise<void> => {
  // In a real app: return (await api.delete(`/clients/${id}`)).data;
  return mockResponse(undefined, 600);
};

// React Query hooks
export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
};

export const useClient = (id: string) => {
  return useQuery<Client, Error>({
    queryKey: ['client', id],
    queryFn: () => fetchClientById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Client, Error, ClientFormData>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Client, Error, { id: string; data: Partial<ClientFormData> }>({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};