import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { mockResponse } from './api';
import { Client, ClientFormData } from '../types/Client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'staff';
    status: 'active' | 'inactive' | 'locked';
    phone?: string;
    avatar?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
    permissions: string[];
  }
  
export interface UserFormData {
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'staff';
    phone?: string;
    status: 'active' | 'inactive' | 'locked';
    password?: string;
    confirmPassword?: string;
    avatar?: string;
    permissions?: string[];
  }

  const mockedUsers: User[] = [
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'manager',
        status: 'active',
        phone: '(555) 987-6543',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastLogin: '2023-06-14T16:30:00Z',
        createdAt: '2022-03-15T10:15:00Z',
        updatedAt: '2023-06-14T16:30:00Z',
        permissions: ['users.view', 'vehicles.manage', 'clients.manage', 'financial.view', 'reports.view'],
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        role: 'staff',
        status: 'active',
        phone: '(555) 456-7890',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastLogin: '2023-06-15T11:20:00Z',
        createdAt: '2022-05-10T14:25:00Z',
        updatedAt: '2023-06-15T11:20:00Z',
        permissions: ['vehicles.view', 'clients.view', 'financial.view'],
      }]
const fetchUsers = async (): Promise<User[]> => {
  return mockResponse(mockedUsers, 800);
};
// React Query hooks
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
