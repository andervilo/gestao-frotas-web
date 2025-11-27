import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = '/api/maintenances';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.apiUrl);
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
