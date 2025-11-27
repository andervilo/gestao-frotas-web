import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { DriverPerformanceReport, DriverStats, DriverCNHExpiring } from '../../models/reports/driver-performance-report.model';

@Component({
  selector: 'app-driver-performance-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-performance-report.component.html',
  styleUrls: ['./driver-performance-report.component.scss']
})
export class DriverPerformanceReportComponent implements OnInit {
  report: DriverPerformanceReport | null = null;
  loading = false;
  error: string | null = null;
  
  startDate: string = '';
  endDate: string = '';
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
    // Set default dates (last 90 days for performance analysis)
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 90);
    
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(ninetyDaysAgo);
    
    this.generateReport();
  }
  
  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Por favor, selecione as datas de início e fim';
      return;
    }
    
    this.loading = true;
    this.error = null;
    console.log('Gerando relatório de desempenho:', this.startDate, 'até', this.endDate);
    
    this.reportService.getDriverPerformanceReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Dados do relatório recebidos:', data);
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de desempenho';
        this.loading = false;
        console.error('Erro ao carregar relatório:', err);
      }
    });
  }
  
  exportToExcel(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadDriverPerformanceExcel(this.startDate, this.endDate);
  }
  
  exportToPDF(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadDriverPerformancePDF(this.startDate, this.endDate);
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'VENCIDA': return 'expired';
      case 'URGENTE': return 'urgent';
      case 'ALTA': return 'high';
      case 'MÉDIA': return 'medium';
      case 'BAIXA': return 'low';
      default: return '';
    }
  }
  
  getRankingClass(ranking: number): string {
    if (ranking <= 3) return 'ranking-top';
    if (ranking <= 10) return 'ranking-good';
    return 'ranking-normal';
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
