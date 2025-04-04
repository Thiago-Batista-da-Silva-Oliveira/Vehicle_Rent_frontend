export type UserRole = 'admin' | 'user' | 'master';


export type UserPermission = 'create:tenant' | 'delete:role' | 'update:user' | 'create:user' | 'read:role' | 'read:tenant' | 'update:role' | 'update:vehicle' | 'create:vehicle' | 'delete:user' | 'create:role' | 'update:tenant' | 'read:vehicle' | 'read:user' | 'delete:tenant' | 'delete:vehicle'

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    roleId?: string;
    permissions: UserPermission[];
    permissionsWithIds: {
        id: string;
        slug: string;
        name: string;
        description: string;
    }[];
    planType: 'free' | 'pro' | 'enterprise';
    avatar?: string;
    createdAt?: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    tenantDomain: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    name: string;
    planType: 'free' | 'pro' | 'enterprise';
  }