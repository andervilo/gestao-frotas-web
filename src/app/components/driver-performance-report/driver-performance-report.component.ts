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
  activeTab: string = 'cnh';
  
  startDate: string = '';
  endDate: string = '';

  // Pagination for CNH expiring
  currentPageCNH = 1;
  itemsPerPageCNH = 5;
  pageSizeOptionsCNH = [5, 10, 25, 50, 100];

  // Pagination for driver stats
  currentPageStats = 1;
  itemsPerPageStats = 5;
  pageSizeOptionsStats = [5, 10, 25, 50, 100];
  
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
        // Define a primeira aba disponível como ativa
        if (data.cnhExpiring && data.cnhExpiring.length > 0) {
          this.activeTab = 'cnh';
        } else if (data.driverStats && data.driverStats.length > 0) {
          this.activeTab = 'stats';
        }
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

  // Pagination methods for CNH expiring
  get paginatedCNH() {
    if (!this.report?.cnhExpiring) return [];
    const start = (this.currentPageCNH - 1) * this.itemsPerPageCNH;
    const end = start + this.itemsPerPageCNH;
    return this.report.cnhExpiring.slice(start, end);
  }

  get totalPagesCNH(): number {
    if (!this.report?.cnhExpiring) return 0;
    return Math.ceil(this.report.cnhExpiring.length / this.itemsPerPageCNH);
  }

  get totalItemsCNH(): number {
    return this.report?.cnhExpiring?.length || 0;
  }

  get pagesCNH(): number[] {
    return Array.from({ length: this.totalPagesCNH }, (_, i) => i + 1);
  }

  changePageCNH(page: number): void {
    if (page >= 1 && page <= this.totalPagesCNH) {
      this.currentPageCNH = page;
    }
  }

  onPageSizeChangeCNH(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageCNH = parseInt(target.value, 10);
    this.currentPageCNH = 1;
  }

  // Pagination methods for driver stats
  get paginatedStats() {
    if (!this.report?.driverStats) return [];
    const start = (this.currentPageStats - 1) * this.itemsPerPageStats;
    const end = start + this.itemsPerPageStats;
    return this.report.driverStats.slice(start, end);
  }

  get totalPagesStats(): number {
    if (!this.report?.driverStats) return 0;
    return Math.ceil(this.report.driverStats.length / this.itemsPerPageStats);
  }

  get totalItemsStats(): number {
    return this.report?.driverStats?.length || 0;
  }

  get pagesStats(): number[] {
    return Array.from({ length: this.totalPagesStats }, (_, i) => i + 1);
  }

  changePageStats(page: number): void {
    if (page >= 1 && page <= this.totalPagesStats) {
      this.currentPageStats = page;
    }
  }

  onPageSizeChangeStats(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageStats = parseInt(target.value, 10);
    this.currentPageStats = 1;
  }
}
