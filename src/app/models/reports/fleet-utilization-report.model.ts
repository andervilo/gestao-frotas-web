export interface FleetUtilizationReport {
  startDate: string;
  endDate: string;
  averageUtilizationRate: number;
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  vehicleUtilization: VehicleUtilization[];
  idleVehiclesList: IdleVehicle[];
}

export interface VehicleUtilization {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  totalTrips: number;
  totalKm: number;
  daysInUse: number;
  daysInMaintenance: number;
  daysIdle: number;
  utilizationRate: number;
  utilizationStatus: string;
}

export interface IdleVehicle {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  daysIdle: number;
  lastTripDate: string | null;
  suggestion: string;
}
