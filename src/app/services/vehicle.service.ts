import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehicleFilter } from '../models/vehicle.model';
import { PagedResponse } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = '/api/vehicles';

  constructor(private http: HttpClient) { }

  getAll(
    filter?: VehicleFilter,
    page: number = 0,
    size: number = 20,
    sort: string = 'licensePlate',
    direction: string = 'asc'
  ): Observable<PagedResponse<Vehicle>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${direction}`);

    if (filter) {
      if (filter.licensePlate) {
        params = params.set('licensePlate', filter.licensePlate);
      }
      if (filter.brand) {
        params = params.set('brand', filter.brand);
      }
      if (filter.model) {
        params = params.set('model', filter.model);
      }
      if (filter.yearFrom) {
        params = params.set('yearFrom', filter.yearFrom.toString());
      }
      if (filter.yearTo) {
        params = params.set('yearTo', filter.yearTo.toString());
      }
    }

    return this.http.get<PagedResponse<Vehicle>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  update(id: string, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
