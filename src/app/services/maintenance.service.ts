import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maintenance } from '../models/maintenance.model';

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
}
