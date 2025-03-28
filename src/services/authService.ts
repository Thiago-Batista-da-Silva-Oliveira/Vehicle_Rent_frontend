import api from './api';
import { LoginCredentials } from '../types/User';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
  tenantId: string;
  roleId: string;
  permissions: string[];
}

interface RefreshTokenRequest {
  refreshToken: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const refreshToken = async (request: RefreshTokenRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/refresh', request);
    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};
