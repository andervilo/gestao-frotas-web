export interface Trip {
  id?: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  startDateTime?: string;
  endDateTime?: string;
  startMileage: number;
  endMileage?: number;
  distanceTraveled?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripFilter {
  vehicleId?: string;
  driverId?: string;
  destination?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}
