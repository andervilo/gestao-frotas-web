export interface DashboardStats {
  // Vehicle stats
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  inMaintenanceVehicles: number;
  
  // Driver stats
  totalDrivers: number;
  activeDrivers: number;
  inactiveDrivers: number;
  
  // Trip stats
  totalTrips: number;
  scheduledTrips: number;
  inProgressTrips: number;
  completedTrips: number;
  
  // Maintenance stats
  totalMaintenances: number;
  scheduledMaintenances: number;
  inProgressMaintenances: number;
  completedMaintenances: number;
}
