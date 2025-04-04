/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import api from './api';
import { queryClient } from '../App';

interface ApiResponse<T> {
  message: string;
  payload: T;
}

interface CreateRoleRequest {
  name: string;
  description: string;
  companyId: string;
  permissions: string[];
}

interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  companyId?: string;
  permissions?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  companyId: string;
  permissions: {
    id: string;
    name: string;
    slug: string;
    description: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

const roleService = {
  listRolesByCompany: async (companyId: string): Promise<Role[]> => {
    try {
      const response = await api.get<ApiResponse<Role[]>>(`/roles/list/${companyId}`);
      return response.data.payload;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao listar perfis');
    }
  },

  getRoleById: async (id: string): Promise<Role> => {
    try {
      const response = await api.get<ApiResponse<Role>>(`/roles/${id}`);
      
      const role = response.data.payload;
      if (!role.permissions) {
        role.permissions = [];
      }
      
      return role;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  },

  createRole: async (data: CreateRoleRequest): Promise<void> => {
    try {
      await api.post<ApiResponse<void>>('/roles', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar perfil');
    }
  },

  updateRole: async (data: UpdateRoleRequest): Promise<void> => {
    try {
      await api.put<void>(`/roles/${data.id}`, {
        name: data.name,
        description: data.description,
        companyId: data.companyId,
        permissions: data.permissions
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  deleteRole: async (id: string): Promise<{ id: string }> => {
    try {
      const response = await api.delete<ApiResponse<{ id: string }>>(`/roles/${id}`);
      return response.data.payload;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir perfil');
    }
  },
};

export const useListRolesByCompany = (companyId: string) => {
  return useQuery({
    queryKey: ['roles', 'company', companyId],
    queryFn: () => roleService.listRolesByCompany(companyId),
    enabled: !!companyId
  });
};

export const useGetRoleById = (id: string) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'company'] });
    }
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: roleService.updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'company'] });
    }
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', 'company'] });
    }
  });
};


export default roleService; 