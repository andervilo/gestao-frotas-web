import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { FleetUtilizationReport } from '../../../models/reports/fleet-utilization-report.model';

@Component({
  selector: 'app-fleet-utilization-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-utilization-report.component.html',
  styleUrl: './fleet-utilization-report.component.scss'
})
export class FleetUtilizationReportComponent implements OnInit {
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  
  report: FleetUtilizationReport | null = null;
  loading = false;
  error: string | null = null;

  // Tabs
  activeTab: 'utilization' | 'idle' = 'utilization';

  // Pagination for vehicle utilization
  currentPageUtilization = 1;
  itemsPerPageUtilization = 5;
  pageSizeOptionsUtilization = [5, 10, 25, 50, 100];

  // Pagination for idle vehicles
  currentPageIdle = 1;
  itemsPerPageIdle = 5;
  pageSizeOptionsIdle = [5, 10, 25, 50, 100];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getFleetUtilizationReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de utilização';
        this.loading = false;
        console.error(err);
      }
    });
  }

  exportExcel(): void {
    this.reportService.downloadFleetUtilizationExcel(this.startDate, this.endDate);
  }

  exportPDF(): void {
    this.reportService.downloadFleetUtilizationPDF(this.startDate, this.endDate);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ALTO': return 'status-high';
      case 'MEDIO': return 'status-medium';
      case 'BAIXO': return 'status-low';
      default: return '';
    }
  }

  // Pagination methods for vehicle utilization
  get paginatedUtilization() {
    if (!this.report?.vehicleUtilization) return [];
    const start = (this.currentPageUtilization - 1) * this.itemsPerPageUtilization;
    const end = start + this.itemsPerPageUtilization;
    return this.report.vehicleUtilization.slice(start, end);
  }

  get totalPagesUtilization(): number {
    if (!this.report?.vehicleUtilization) return 0;
    return Math.ceil(this.report.vehicleUtilization.length / this.itemsPerPageUtilization);
  }

  get totalItemsUtilization(): number {
    return this.report?.vehicleUtilization?.length || 0;
  }

  get pagesUtilization(): number[] {
    return Array.from({ length: this.totalPagesUtilization }, (_, i) => i + 1);
  }

  changePageUtilization(page: number): void {
    if (page >= 1 && page <= this.totalPagesUtilization) {
      this.currentPageUtilization = page;
    }
  }

  onPageSizeChangeUtilization(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageUtilization = parseInt(target.value, 10);
    this.currentPageUtilization = 1;
  }

  // Pagination methods for idle vehicles
  get paginatedIdle() {
    if (!this.report?.idleVehiclesList) return [];
    const start = (this.currentPageIdle - 1) * this.itemsPerPageIdle;
    const end = start + this.itemsPerPageIdle;
    return this.report.idleVehiclesList.slice(start, end);
  }

  get totalPagesIdle(): number {
    if (!this.report?.idleVehiclesList) return 0;
    return Math.ceil(this.report.idleVehiclesList.length / this.itemsPerPageIdle);
  }

  get totalItemsIdle(): number {
    return this.report?.idleVehiclesList?.length || 0;
  }

  get pagesIdle(): number[] {
    return Array.from({ length: this.totalPagesIdle }, (_, i) => i + 1);
  }

  changePageIdle(page: number): void {
    if (page >= 1 && page <= this.totalPagesIdle) {
      this.currentPageIdle = page;
    }
  }

  onPageSizeChangeIdle(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageIdle = parseInt(target.value, 10);
    this.currentPageIdle = 1;
  }
}
