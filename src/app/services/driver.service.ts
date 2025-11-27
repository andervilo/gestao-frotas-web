import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver, DriverFilter, PagedResponse } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = '/api/drivers';

  constructor(private http: HttpClient) { }

  getAll(
    filter?: DriverFilter,
    page: number = 0,
    size: number = 20,
    sort: string = 'name',
    direction: string = 'asc'
  ): Observable<PagedResponse<Driver>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${direction}`);

    if (filter) {
      if (filter.name) {
        params = params.set('name', filter.name);
      }
      if (filter.cpf) {
        params = params.set('cpf', filter.cpf);
      }
      if (filter.cnh) {
        params = params.set('cnh', filter.cnh);
      }
      if (filter.cnhCategory) {
        params = params.set('cnhCategory', filter.cnhCategory);
      }
      if (filter.cnhExpirationDateFrom) {
        params = params.set('cnhExpirationDateFrom', filter.cnhExpirationDateFrom);
      }
      if (filter.cnhExpirationDateTo) {
        params = params.set('cnhExpirationDateTo', filter.cnhExpirationDateTo);
      }
    }

    return this.http.get<PagedResponse<Driver>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  create(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  update(id: string, driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}`, driver);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
