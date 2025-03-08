export interface DashboardStats {
    totalVehicles: number;
    availableVehicles: number;
    totalClients: number;
    activeClients: number;
    totalRentals: number;
    activeRentals: number;
    revenue: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
    popularVehicles: {
      vehicleId: string;
      make: string;
      model: string;
      rentalCount: number;
    }[];
    recentActivity: {
      id: string;
      type: 'rental' | 'client' | 'vehicle' | 'maintenance';
      title: string;
      description: string;
      date: string;
    }[];
    visitorStats: {
      date: string;
      visitors: number;
    }[];
  }