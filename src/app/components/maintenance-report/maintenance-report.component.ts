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
}
