import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { MaintenanceReport, MaintenanceHistory, UpcomingMaintenance, OverdueMaintenance } from '../../models/reports/maintenance-report.model';

@Component({
  selector: 'app-maintenance-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss']
})
export class MaintenanceReportComponent implements OnInit {
  report: MaintenanceReport | null = null;
  loading = false;
  error: string | null = null;
  
  startDate: string = '';
  endDate: string = '';

  // Pagination for overdue
  currentPageOverdue = 1;
  itemsPerPageOverdue = 10;
  pageSizeOptionsOverdue = [5, 10, 25, 50, 100];

  // Pagination for upcoming
  currentPageUpcoming = 1;
  itemsPerPageUpcoming = 10;
  pageSizeOptionsUpcoming = [5, 10, 25, 50, 100];

  // Pagination for history
  currentPageHistory = 1;
  itemsPerPageHistory = 10;
  pageSizeOptionsHistory = [5, 10, 25, 50, 100];
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(thirtyDaysAgo);
    
    this.generateReport();
  }
  
  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Por favor, selecione as datas de início e fim';
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.reportService.getMaintenanceReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Maintenance Report data received:', data);
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de manutenção';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  exportToExcel(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadMaintenanceReportExcel(this.startDate, this.endDate);
  }
  
  exportToPDF(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadMaintenanceReportPDF(this.startDate, this.endDate);
  }
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'ALTA': return 'priority-high';
      case 'MEDIA': return 'priority-medium';
      case 'BAIXA': return 'priority-low';
      default: return '';
    }
  }
  
  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICA': return 'severity-critical';
      case 'ALTA': return 'severity-high';
      case 'MEDIA': return 'severity-medium';
      default: return '';
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Pagination methods for overdue maintenances
  get paginatedOverdue() {
    if (!this.report?.overdue) return [];
    const start = (this.currentPageOverdue - 1) * this.itemsPerPageOverdue;
    const end = start + this.itemsPerPageOverdue;
    return this.report.overdue.slice(start, end);
  }

  get totalPagesOverdue(): number {
    if (!this.report?.overdue) return 0;
    return Math.ceil(this.report.overdue.length / this.itemsPerPageOverdue);
  }

  get totalItemsOverdue(): number {
    return this.report?.overdue?.length || 0;
  }

  get pagesOverdue(): number[] {
    return Array.from({ length: this.totalPagesOverdue }, (_, i) => i + 1);
  }

  changePageOverdue(page: number): void {
    if (page >= 1 && page <= this.totalPagesOverdue) {
      this.currentPageOverdue = page;
    }
  }

  onPageSizeChangeOverdue(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageOverdue = parseInt(target.value, 10);
    this.currentPageOverdue = 1;
  }

  // Pagination methods for upcoming maintenances
  get paginatedUpcoming() {
    if (!this.report?.upcoming) return [];
    const start = (this.currentPageUpcoming - 1) * this.itemsPerPageUpcoming;
    const end = start + this.itemsPerPageUpcoming;
    return this.report.upcoming.slice(start, end);
  }

  get totalPagesUpcoming(): number {
    if (!this.report?.upcoming) return 0;
    return Math.ceil(this.report.upcoming.length / this.itemsPerPageUpcoming);
  }

  get totalItemsUpcoming(): number {
    return this.report?.upcoming?.length || 0;
  }

  get pagesUpcoming(): number[] {
    return Array.from({ length: this.totalPagesUpcoming }, (_, i) => i + 1);
  }

  changePageUpcoming(page: number): void {
    if (page >= 1 && page <= this.totalPagesUpcoming) {
      this.currentPageUpcoming = page;
    }
  }

  onPageSizeChangeUpcoming(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageUpcoming = parseInt(target.value, 10);
    this.currentPageUpcoming = 1;
  }

  // Pagination methods for history
  get paginatedHistory() {
    if (!this.report?.history) return [];
    const start = (this.currentPageHistory - 1) * this.itemsPerPageHistory;
    const end = start + this.itemsPerPageHistory;
    return this.report.history.slice(start, end);
  }

  get totalPagesHistory(): number {
    if (!this.report?.history) return 0;
    return Math.ceil(this.report.history.length / this.itemsPerPageHistory);
  }

  get totalItemsHistory(): number {
    return this.report?.history?.length || 0;
  }

  get pagesHistory(): number[] {
    return Array.from({ length: this.totalPagesHistory }, (_, i) => i + 1);
  }

  changePageHistory(page: number): void {
    if (page >= 1 && page <= this.totalPagesHistory) {
      this.currentPageHistory = page;
    }
  }

  onPageSizeChangeHistory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageHistory = parseInt(target.value, 10);
    this.currentPageHistory = 1;
  }
}
