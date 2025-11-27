export interface VehicleDepreciation {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  purchaseValue: number;
  currentValue: number;
  totalDepreciation: number;
  depreciationRate: number;
  ageInYears: number;
  purchaseDate: string;
}

export interface DepreciationReport {
  totalFleetValue: number;
  totalDepreciation: number;
  averageFleetAge: number;
  vehicleDepreciation: VehicleDepreciation[];
}
