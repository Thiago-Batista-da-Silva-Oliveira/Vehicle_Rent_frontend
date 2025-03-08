export interface Plan {
    id: string;
    name: 'Free' | 'Pro' | 'Enterprise';
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    limitations: {
      maxVehicles: number;
      maxClients: number;
      additionalFeatures: string[];
    };
  }