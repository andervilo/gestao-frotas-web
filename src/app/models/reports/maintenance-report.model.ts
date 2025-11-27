export interface MaintenanceHistory {
  vehicleId: string;
  licensePlate: string;
  type: string;
  description: string;
  scheduledDate: string;
  completionDate: string | null;
  cost: number;
  status: string;
}

export interface UpcomingMaintenance {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  type: string;
  scheduledDate: string;
  daysUntil: number;
  priority: string;
}

export interface OverdueMaintenance {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  type: string;
  scheduledDate: string;
  daysOverdue: number;
  severity: string;
}

export interface MaintenanceReport {
  startDate: string;
  endDate: string;
  history: MaintenanceHistory[];
  upcoming: UpcomingMaintenance[];
  overdue: OverdueMaintenance[];
  totalMaintenances: number;
  preventiveCount: number;
  correctiveCount: number;
  totalCost: number;
  averageDaysInMaintenance: number;
}
