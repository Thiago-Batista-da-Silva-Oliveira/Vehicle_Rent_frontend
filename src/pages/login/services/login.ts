import api from "../../../services/api";
import { LoginCredentials } from "../../../types/User";

interface IOutput {
accessToken: string;
refreshToken: string;
userId: string;
email: string;
name: string;
tenantId: string;
roleId?: string;
permissions?: string[];
permissionsWithIds?: {
    id: string;
    slug: string;
    name: string;
    description: string;
  }[];
}

export const login = async (credentials: LoginCredentials): Promise<IOutput> => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};