export interface VehicleMaintenanceStats {
  licensePlate: string;
  maintenanceCount: number;
  totalCost: number;
}

export interface CorrectiveMaintenanceReport {
  startDate: string;
  endDate: string;
  totalCorrectiveMaintenances: number;
  totalCost: number;
  averageCost: number;
  correctiveHistory: Array<{
    vehicleId: string;
    licensePlate: string;
    type: string;
    description: string;
    scheduledDate: string;
    completionDate: string | null;
    cost: number;
    status: string;
  }>;
  upcomingCorrective: Array<{
    vehicleId: string;
    licensePlate: string;
    brand: string;
    model: string;
    type: string;
    scheduledDate: string;
    daysUntil: number;
    priority: string;
  }>;
  overdueCorrective: Array<{
    vehicleId: string;
    licensePlate: string;
    brand: string;
    model: string;
    type: string;
    scheduledDate: string;
    daysOverdue: number;
    severity: string;
  }>;
  topVehicles: VehicleMaintenanceStats[];
}
