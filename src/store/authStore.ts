import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginCredentials, User, UserPermission } from '../types/User';
import { login } from '../pages/login/services/login';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

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
         const response = await login(credentials);
          const token = response.accessToken;
          localStorage.setItem('auth-token', token);
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user: {
              ...response,
              id: response.userId,
              planType: 'free',
              role: 'user',
              permissions: response.permissions as UserPermission[],
            },
            token,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Invalid email or password',
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