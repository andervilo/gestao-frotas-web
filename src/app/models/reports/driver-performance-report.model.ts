export interface DriverStats {
  driverId: string;
  name: string;
  cnh: string;
  totalTrips: number;
  totalKm: number;
  utilizationRate: number;
  ranking: number;
}

export interface DriverCNHExpiring {
  driverId: string;
  name: string;
  cnh: string;
  cnhExpiration: string;
  daysUntilExpiration: number;
  status: string;
}

export interface DriverPerformanceReport {
  startDate: string;
  endDate: string;
  driverStats: DriverStats[];
  cnhExpiring: DriverCNHExpiring[];
  totalDrivers: number;
  activeDrivers: number;
}
