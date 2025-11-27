export interface CostReport {
  startDate: string;
  endDate: string;
  totalCost: number;
  totalMaintenance: number;
  averageCostPerVehicle: number;
  averageCostPerKm: number;
  vehicleCosts: VehicleCost[];
  monthlyCosts: MonthlyCost[];
  projections: CostProjection[];
}

export interface VehicleCost {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  totalCost: number;
  maintenanceCost: number;
  totalKm: number;
  costPerKm: number;
  ranking: number;
}

export interface MonthlyCost {
  month: string;
  totalCost: number;
  maintenanceCost: number;
  totalKm: number;
}

export interface CostProjection {
  month: string;
  projectedCost: number;
  trend: number;
}
