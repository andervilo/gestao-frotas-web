import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maintenance, MaintenanceStatus, MaintenanceType, MaintenanceFilter } from '../models/maintenance.model';
import { PagedResponse } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = '/api/maintenances';

  constructor(private http: HttpClient) { }

  getAll(
    filter: MaintenanceFilter = {},
    page: number = 0,
    size: number = 10,
    sortBy: string = 'scheduledDate',
    direction: string = 'DESC'
  ): Observable<PagedResponse<Maintenance>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (filter.vehicleId) {
      params = params.set('vehicleId', filter.vehicleId);
    }
    if (filter.type) {
      params = params.set('type', filter.type);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.description) {
      params = params.set('description', filter.description);
    }
    if (filter.scheduledDateFrom) {
      params = params.set('scheduledDateFrom', filter.scheduledDateFrom);
    }
    if (filter.scheduledDateTo) {
      params = params.set('scheduledDateTo', filter.scheduledDateTo);
    }
    if (filter.completedDateFrom) {
      params = params.set('completedDateFrom', filter.completedDateFrom);
    }
    if (filter.completedDateTo) {
      params = params.set('completedDateTo', filter.completedDateTo);
    }

    return this.http.get<PagedResponse<Maintenance>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`);
  }

  create(maintenance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.apiUrl, maintenance);
  }

  update(id: string, maintenance: Maintenance): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, maintenance);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos adicionais baseados nos use cases do backend
  getByVehicleId(vehicleId: string): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  getByStatus(status: MaintenanceStatus): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/status/${status}`);
  }

  getByType(type: MaintenanceType): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/type/${type}`);
  }

  startMaintenance(id: string): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}/start`, null);
  }

  completeMaintenance(id: string, finalCost: number, notes?: string): Observable<Maintenance> {
    const params: any = { finalCost: finalCost.toString() };
    if (notes) {
      params.notes = notes;
    }
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}/complete`, null, { params });
  }

  cancelMaintenance(id: string, reason: string): Observable<Maintenance> {
    const params = { reason };
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}/cancel`, null, { params });
  }
}
