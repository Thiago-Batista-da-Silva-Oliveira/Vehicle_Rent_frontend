import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import useNotification from '../hooks/useNotification';
import { queryClient } from '../App';

// API interfaces
export interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  roleId: string;
  tenantId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  tenantId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: string;
  tenantId: string;
  active?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  roleId?: string;
  active?: boolean;
  tenantId?: string;
}

export interface GetUsersParams {
  tenantId?: string;
}

// API functions
const apiGetAllUsers = async (params?: GetUsersParams): Promise<User[]> => {
  try {
    const response = await api.get<UserApiResponse[]>('/users', { params });
    return response.data.map(mapUserFromAPI);
  } catch (error) {
    throw new Error('Falha ao buscar usuários');
  }
};

const apiGetUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get<UserApiResponse>(`/users/${id}`);
    return mapUserFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao buscar usuário');
  }
};

const apiCreateUser = async (data: CreateUserData): Promise<User> => {
  try {
    const response = await api.post<UserApiResponse>('/users', data);
    return mapUserFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao criar usuário');
  }
};

const apiUpdateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  try {
    const response = await api.put<UserApiResponse>(`/users/${id}`, data);
    return mapUserFromAPI(response.data);
  } catch (error) {
    throw new Error('Falha ao atualizar usuário');
  }
};

const apiDeleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw new Error('Falha ao excluir usuário');
  }
};

// Converters between frontend and API formats
const mapUserFromAPI = (apiUser: UserApiResponse): User => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    roleId: apiUser.roleId,
    tenantId: apiUser.tenantId,
    active: apiUser.active,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
  };
};

// React Query hooks
export const useUsers = (params?: GetUsersParams) => {
  const notification = useNotification();
  
  return useQuery<User[], Error>({
    queryKey: ['users', params],
    queryFn: () => apiGetAllUsers(params),
    onError: (error) => {
      notification.showError(`Erro ao carregar usuários: ${error.message}`);
    }
  });
};

export const useUser = (id: string) => {
  const notification = useNotification();
  
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => apiGetUserById(id),
    enabled: !!id,
    onError: (error) => {
      notification.showError(`Erro ao carregar detalhes do usuário: ${error.message}`);
    }
  });
};

export const useCreateUser = () => {
  const notification = useNotification();
  
  return useMutation<User, Error, CreateUserData>({
    mutationFn: apiCreateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notification.showSuccess(`Usuário ${data.name} criado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao criar usuário: ${error.message}`);
    }
  });
};

export const useUpdateUser = () => {
  const notification = useNotification();
  
  return useMutation<User, Error, { id: string; data: UpdateUserData }>({
    mutationFn: ({ id, data }) => apiUpdateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      notification.showSuccess(`Usuário ${data.name} atualizado com sucesso!`);
    },
    onError: (error) => {
      notification.showError(`Erro ao atualizar usuário: ${error.message}`);
    }
  });
};

export const useDeleteUser = () => {
  const notification = useNotification();
  
  return useMutation<void, Error, string>({
    mutationFn: apiDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notification.showSuccess('Usuário excluído com sucesso!');
    },
    onError: (error) => {
      notification.showError(`Erro ao excluir usuário: ${error.message}`);
    }
  });
}; 