import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import useNotification from '../hooks/useNotification';
import { queryClient } from '../App';

// Interfaces
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantData {
  name: string;
  domain: string;
  active: boolean;
}

export interface UpdateTenantData {
  name?: string;
  domain?: string;
  active?: boolean;
}

// API interfaces
interface TenantApiResponse {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// API functions
const apiCreateTenant = async (tenant: CreateTenantData): Promise<Tenant> => {
  try {
    const response = await api.post<TenantApiResponse>('/tenants', tenant);
    return mapTenantFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao criar tenant');
  }
};

const apiGetAllTenants = async (): Promise<Tenant[]> => {
  try {
    const response = await api.get<TenantApiResponse[]>('/tenants');
    return response.data.map(mapTenantFromAPI);
  } catch (error) {
    throw new Error('Falha ao buscar tenants');
  }
};

const apiGetTenantById = async (id: string): Promise<Tenant> => {
  try {
    const response = await api.get<TenantApiResponse>(`/tenants/${id}`);
    return mapTenantFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao buscar tenant');
  }
};

const apiUpdateTenant = async (id: string, tenant: UpdateTenantData): Promise<Tenant> => {
  try {
    const response = await api.put<TenantApiResponse>(`/tenants/${id}`, tenant);
    return mapTenantFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao atualizar tenant');
  }
};

const apiDeleteTenant = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tenants/${id}`);
  } catch (error) {
    throw new Error('Falha ao excluir tenant');
  }
};

// Mappers
const mapTenantFromAPI = (apiTenant: TenantApiResponse): Tenant => {
  return {
    id: apiTenant.id,
    name: apiTenant.name,
    domain: apiTenant.domain,
    active: apiTenant.active,
    createdAt: new Date(apiTenant.createdAt),
    updatedAt: new Date(apiTenant.updatedAt),
  };
};

// React Query hooks
export const useTenants = () => {
  const notification = useNotification();
  
  return useQuery<Tenant[], Error>({
    queryKey: ['tenants'],
    queryFn: apiGetAllTenants,
    onError: (error) => {
      notification.showError(`Erro ao carregar tenants: ${error.message}`);
    }
  });
};

export const useTenant = (id: string) => {
  const notification = useNotification();
  
  return useQuery<Tenant, Error>({
    queryKey: ['tenant', id],
    queryFn: () => apiGetTenantById(id),
    enabled: !!id,
    onError: (error) => {
      notification.showError(`Erro ao carregar detalhes do tenant: ${error.message}`);
    }
  });
};

export const useCreateTenant = () => {
  const notification = useNotification();
  
  return useMutation<Tenant, Error, CreateTenantData>({
    mutationFn: apiCreateTenant,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      notification.showSuccess(`Tenant ${data.name} criado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao criar tenant: ${error.message}`);
    }
  });
};

export const useUpdateTenant = () => {
  const notification = useNotification();
  
  return useMutation<Tenant, Error, { id: string; data: UpdateTenantData }>({
    mutationFn: ({ id, data }) => apiUpdateTenant(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', data.id] });
      notification.showSuccess(`Tenant ${data.name} atualizado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao atualizar tenant: ${error.message}`);
    }
  });
};

export const useDeleteTenant = () => {
  const notification = useNotification();
  
  return useMutation<void, Error, string>({
    mutationFn: apiDeleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      notification.showSuccess('Tenant excluído com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao excluir tenant: ${error.message}`);
    }
  });
};
