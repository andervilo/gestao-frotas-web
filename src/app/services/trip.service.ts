import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, TripFilter } from '../models/trip.model';
import { PagedResponse } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = '/api/trips';

  constructor(private http: HttpClient) { }

  getAll(
    filter: TripFilter = {},
    page: number = 0,
    size: number = 10,
    sortBy: string = 'startDateTime',
    direction: string = 'DESC'
  ): Observable<PagedResponse<Trip>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (filter.vehicleId) {
      params = params.set('vehicleId', filter.vehicleId);
    }
    if (filter.driverId) {
      params = params.set('driverId', filter.driverId);
    }
    if (filter.destination) {
      params = params.set('destination', filter.destination);
    }
    if (filter.startDateFrom) {
      params = params.set('startDateFrom', filter.startDateFrom);
    }
    if (filter.startDateTo) {
      params = params.set('startDateTo', filter.startDateTo);
    }
    if (filter.endDateFrom) {
      params = params.set('endDateFrom', filter.endDateFrom);
    }
    if (filter.endDateTo) {
      params = params.set('endDateTo', filter.endDateTo);
    }

    return this.http.get<PagedResponse<Trip>>(this.apiUrl, { params });
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

  getCompletedTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/completed`);
  }

  getScheduledTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/scheduled`);
  }

  completeTrip(id: string, endMileage: number, notes?: string): Observable<Trip> {
    const params: any = { endMileage: endMileage.toString() };
    if (notes) {
      params.notes = notes;
    }
    return this.http.put<Trip>(`${this.apiUrl}/${id}/complete`, null, { params });
  }
}
