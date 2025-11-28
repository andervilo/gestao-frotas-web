export enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  BUS = 'BUS',
  MOTORCYCLE = 'MOTORCYCLE'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Vehicle {
  id?: string;
  licensePlate: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  status?: VehicleStatus;
  currentMileage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleFilter {
  licensePlate?: string;
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
}
