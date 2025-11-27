export interface RouteFrequency {
  origin: string;
  destination: string;
  tripCount: number;
  totalKm: number;
  averageKm: number;
}

export interface TripReport {
  startDate: string;
  endDate: string;
  topRoutes: RouteFrequency[];
  tripsByStatus: { [key: string]: number };
  totalTrips: number;
  totalKm: number;
  averageDistance: number;
}
