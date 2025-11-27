import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CostReport } from '../models/reports/cost-report.model';
import { FleetUtilizationReport } from '../models/reports/fleet-utilization-report.model';
import { MaintenanceReport } from '../models/reports/maintenance-report.model';
import { DriverPerformanceReport } from '../models/reports/driver-performance-report.model';
import { TripReport } from '../models/reports/trip-report.model';
import { DepreciationReport } from '../models/reports/depreciation-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  // ===== Relatório 1: Custos Operacionais =====

  getCostReport(startDate: string, endDate: string): Observable<CostReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<CostReport>(`${this.apiUrl}/costs`, { params });
  }

  downloadCostReportExcel(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/costs/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-custos-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadCostReportPDF(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/costs/export/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-custos-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Relatório 2: Utilização de Frota =====

  getFleetUtilizationReport(startDate: string, endDate: string): Observable<FleetUtilizationReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<FleetUtilizationReport>(`${this.apiUrl}/fleet-utilization`, { params });
  }

  downloadFleetUtilizationExcel(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/fleet-utilization/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-utilizacao-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadFleetUtilizationPDF(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/fleet-utilization/export/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-utilizacao-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Relatório 3: Manutenção Preventiva =====

  getMaintenanceReport(startDate: string, endDate: string): Observable<MaintenanceReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<MaintenanceReport>(`${this.apiUrl}/maintenance`, { params });
  }

  downloadMaintenanceReportExcel(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/maintenance/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-manutencao-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadMaintenanceReportPDF(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/maintenance/export/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-manutencao-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Relatório 4: Desempenho de Motoristas =====

  getDriverPerformanceReport(startDate: string, endDate: string): Observable<DriverPerformanceReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<DriverPerformanceReport>(`${this.apiUrl}/driver-performance`, { params });
  }

  downloadDriverPerformanceExcel(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/driver-performance/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-desempenho-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadDriverPerformancePDF(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/driver-performance/export/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-desempenho-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Relatório 5: Viagens =====

  getTripReport(startDate: string, endDate: string): Observable<TripReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TripReport>(`${this.apiUrl}/trips`, { params });
  }

  downloadTripReportExcel(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/trips/export/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-viagens-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadTripReportPDF(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/trips/export/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-viagens-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Relatório 6: Depreciação de Veículos =====

  getDepreciationReport(): Observable<DepreciationReport> {
    return this.http.get<DepreciationReport>(`${this.apiUrl}/depreciation`);
  }

  downloadDepreciationReportExcel(): void {
    this.http.get(`${this.apiUrl}/depreciation/export/excel`, { 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-depreciacao-${new Date().toISOString().split('T')[0]}.xlsx`),
      error: (err) => console.error('Erro ao exportar Excel', err)
    });
  }

  downloadDepreciationReportPDF(): void {
    this.http.get(`${this.apiUrl}/depreciation/export/pdf`, { 
      responseType: 'blob' 
    }).subscribe({
      next: (blob) => this.downloadFile(blob, `relatorio-depreciacao-${new Date().toISOString().split('T')[0]}.pdf`),
      error: (err) => console.error('Erro ao exportar PDF', err)
    });
  }

  // ===== Utilitário para Download =====

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
