import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = '/api/trips';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  create(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  update(id: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos adicionais baseados nos use cases do backend
  getByVehicleId(vehicleId: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  getByDriverId(driverId: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  getInProgressTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/in-progress`);
  }

  completeTrip(id: string, endMileage: number, notes?: string): Observable<Trip> {
    const params: any = { endMileage: endMileage.toString() };
    if (notes) {
      params.notes = notes;
    }
    return this.http.put<Trip>(`${this.apiUrl}/${id}/complete`, null, { params });
  }
}
