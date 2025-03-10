import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { mockResponse } from '../services/api';
import { LoginCredentials, RegisterData, User } from '../types/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'master',
  planType: 'pro',
  avatar: 'https://i.pravatar.cc/300',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // const response = await api.post('/auth/login', credentials);
          
          // Mock response for development
          await mockResponse(null, 800);
          
          // Simulating successful login
          const token = 'mock-jwt-token';
          localStorage.setItem('auth-token', token);
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user: mockUser,
            token,
          });
        } catch (error) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: 'Invalid email or password',
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },
      
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // const response = await api.post('/auth/register', data);
          
          // Mock response for development
          await mockResponse(null, 800);
          
          // Simulating successful registration and login
          const token = 'mock-jwt-token';
          localStorage.setItem('auth-token', token);
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user: {
              ...mockUser,
              name: data.name,
              email: data.email,
              planType: data.planType,
            },
            token,
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({
            isLoading: false,
            error: 'Registration failed. Please try again.',
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },
      
      logout: () => {
        localStorage.removeItem('auth-token');
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'vehicle-rentx-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;