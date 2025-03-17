export type UserRole = 'admin' | 'user' | 'master';

export type UserPermission = 'dashboard' | 'users' | 'cars' | 'rentals' | 'settings';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: UserPermission[];
    planType: 'free' | 'pro' | 'enterprise';
    avatar?: string;
    createdAt: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    name: string;
    planType: 'free' | 'pro' | 'enterprise';
  }