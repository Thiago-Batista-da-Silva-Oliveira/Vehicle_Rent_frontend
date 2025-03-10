export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'master';
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