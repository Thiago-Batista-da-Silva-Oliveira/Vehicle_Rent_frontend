import { useQuery, useMutation } from "@tanstack/react-query";
import api from "./api";
import useNotification from "../hooks/useNotification";
import { queryClient } from "../App";

interface ApiResponse<T> {
  message: string;
  payload: T;
}

interface IGenerateRental {
  startDate: Date;
  endDate: Date;
  dailyRate?: number;
  totalAmount?: number;
  depositAmount?: number;
  customerId: string;
  vehicleId: string;
  checkoutMileage?: number;
  observations?: string;
  useAutomaticCalculation?: boolean;
}

export interface IRental {
  id: string;
  startDate: Date;
  endDate: Date;
  actualReturnDate: Date;
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  dailyRate: number;
  totalAmount: number;
  depositAmount?: number;
  customerId: string;
  vehicleId: string;
  contractId?: string;
  tenantId: string;
  checkoutMileage?: number;
  returnMileage?: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Complete Rental
interface ICompleteRental {
  actualEndDate: Date;
  finalMileage: number;
  observations?: string;
}

// Calculate Rental
interface ICalculateRental {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
}

interface IRentalCalculation {
  dailyRate: number;
  totalAmount: number;
  depositAmount: number;
  days: number;
}

interface IRentalFilters {
  status?: string;
  customerId?: string;
  vehicleId?: string;
  startDate?: Date;
  endDate?: Date;
}

// Update Rental Status
interface IUpdateRentalStatus {
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  observations?: string;
}
const apiGenerateRental = async (data: IGenerateRental): Promise<IRental> => {
  try {
    const response = await api.post<ApiResponse<IRental>>("/rentals", data);
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao gerar aluguel");
  }
};

const apiCompleteRental = async (
  id: string,
  data: ICompleteRental
): Promise<IRental> => {
  try {
    const response = await api.put<ApiResponse<IRental>>(
      `/rentals/${id}/complete`,
      data
    );
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao completar aluguel");
  }
};

const apiCalculateRental = async (
  data: ICalculateRental
): Promise<IRentalCalculation> => {
  try {
    const response = await api.post<ApiResponse<IRentalCalculation>>(
      "/rentals/calculate",
      data
    );
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao calcular aluguel");
  }
};

const apiGetRentalById = async (id: string): Promise<IRental> => {
  try {
    const response = await api.get<ApiResponse<IRental>>(`/rentals/${id}`);
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao buscar aluguel");
  }
};

// Get All Rentals
const apiGetAllRentals = async (
  filters: IRentalFilters = {}
): Promise<IRental[]> => {
  try {
    const response = await api.get<ApiResponse<IRental[]>>("/rentals", {
      params: filters,
    });
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao buscar aluguéis");
  }
};

const apiUpdateRentalStatus = async (
  id: string,
  data: IUpdateRentalStatus
): Promise<IRental> => {
  try {
    const response = await api.put<ApiResponse<IRental>>(
      `/rentals/${id}/status`,
      data
    );
    return response.data.payload;
  } catch (error) {
    throw new Error("Falha ao atualizar status do aluguel");
  }
};

export const useGetAllRentals = (filters: IRentalFilters = {}) => {
  return useQuery<IRental[], Error>({
    queryKey: ["rentals", filters],
    queryFn: () => apiGetAllRentals(filters),
  });
};

// Get Rental by ID

export const useGetRentalById = (id: string) => {
  return useQuery<IRental, Error>({
    queryKey: ["rental", id],
    queryFn: () => apiGetRentalById(id),
    enabled: !!id,
  });
};

export const useUpdateRentalStatus = () => {
  const notification = useNotification();

  return useMutation<IRental, Error, { id: string; data: IUpdateRentalStatus }>(
    {
      mutationFn: ({ id, data }) => apiUpdateRentalStatus(id, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["rentals"] });
        queryClient.invalidateQueries({ queryKey: ["rental", data.id] });
        notification.showSuccess(`Status do aluguel atualizado com sucesso`);
      },
      onError: (error) => {
        notification.showError(
          `Erro ao atualizar status do aluguel: ${error.message}`
        );
      },
    }
  );
};

export const useCompleteRental = () => {
  const notification = useNotification();

  return useMutation<IRental, Error, { id: string; data: ICompleteRental }>({
    mutationFn: ({ id, data }) => apiCompleteRental(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["rental", data.id] });
      notification.showSuccess(`Aluguel completado com sucesso`);
    },
    onError: (error) => {
      notification.showError(`Erro ao completar aluguel: ${error.message}`);
    },
  });
};

export const useGenerateRental = () => {
  const notification = useNotification();

  return useMutation<IRental, Error, IGenerateRental>({
    mutationFn: apiGenerateRental,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      notification.showSuccess(`Aluguel gerado com sucesso`);
    },
    onError: (error) => {
      notification.showError(`Erro ao gerar aluguel: ${error.message}`);
    },
  });
};

export const useCalculateRental = () => {
  const notification = useNotification();

  return useMutation<IRentalCalculation, Error, ICalculateRental>({
    mutationFn: apiCalculateRental,
    onError: (error) => {
      notification.showError(`Erro ao calcular aluguel: ${error.message}`);
    },
  });
};
