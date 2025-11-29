import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { TripReport } from '../../models/reports/trip-report.model';

@Component({
  selector: 'app-trip-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent implements OnInit {
  report: TripReport | null = null;
  loading = false;
  error: string | null = null;
  activeTab: string = 'topRoutes';
  startDate: string = '';
  endDate: string = '';

  // Pagination for top routes
  currentPageTopRoutes = 1;
  itemsPerPageTopRoutes = 5;
  pageSizeOptionsTopRoutes = [5, 10, 25, 50, 100];
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
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
    console.log('Gerando relatório de viagens:', this.startDate, 'até', this.endDate);
    this.reportService.getTripReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Dados do relatório recebidos:', data);
        this.report = data;
        this.loading = false;
        // Define a primeira aba disponível como ativa
        if (data.topRoutes && data.topRoutes.length > 0) {
          this.activeTab = 'topRoutes';
        } else {
          this.activeTab = 'byStatus';
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de viagens';
        this.loading = false;
        console.error('Erro ao carregar relatório:', err);
      }
    });
  }
  
  exportToExcel(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadTripReportExcel(this.startDate, this.endDate);
  }
  
  exportToPDF(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadTripReportPDF(this.startDate, this.endDate);
  }
  
  getStatusKeys(): string[] {
    return this.report ? Object.keys(this.report.tripsByStatus) : [];
  }
  
  translateStatus(status: string): string {
    const translations: { [key: string]: string } = {
      'COMPLETED': 'Concluída',
      'SCHEDULED': 'Agendada',
      'CANCELED': 'Cancelada',
      'IN_PROGRESS': 'Em Andamento'
    };
    return translations[status] || status;
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Pagination methods for top routes
  get paginatedTopRoutes() {
    if (!this.report?.topRoutes) return [];
    const start = (this.currentPageTopRoutes - 1) * this.itemsPerPageTopRoutes;
    const end = start + this.itemsPerPageTopRoutes;
    return this.report.topRoutes.slice(start, end);
  }

  get totalPagesTopRoutes(): number {
    if (!this.report?.topRoutes) return 0;
    return Math.ceil(this.report.topRoutes.length / this.itemsPerPageTopRoutes);
  }

  get totalItemsTopRoutes(): number {
    return this.report?.topRoutes?.length || 0;
  }

  get pagesTopRoutes(): number[] {
    return Array.from({ length: this.totalPagesTopRoutes }, (_, i) => i + 1);
  }

  changePageTopRoutes(page: number): void {
    if (page >= 1 && page <= this.totalPagesTopRoutes) {
      this.currentPageTopRoutes = page;
    }
  }

  onPageSizeChangeTopRoutes(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageTopRoutes = parseInt(target.value, 10);
    this.currentPageTopRoutes = 1;
  }

  // Excel Export Methods
  exportTopRoutesExcel(): void {
    if (!this.report?.topRoutes || this.report.topRoutes.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const data = this.report.topRoutes.map(item => ({
      'Origem': item.origin,
      'Destino': item.destination,
      'Nº Viagens': item.tripCount,
      'Distância Total (km)': item.totalKm,
      'Distância Média (km)': item.averageKm
    }));

    this.exportTabToExcel(data, 'Rotas_Frequentes');
  }

  exportByStatusExcel(): void {
    if (!this.report?.tripsByStatus) {
      alert('Não há dados para exportar');
      return;
    }

    const data = Object.keys(this.report.tripsByStatus).map(status => ({
      'Status': status,
      'Quantidade': this.report!.tripsByStatus[status]
    }));

    this.exportTabToExcel(data, 'Viagens_Por_Status');
  }

  private exportTabToExcel(data: any[], filename: string): void {
    const worksheet = this.createWorksheet(data);
    const workbook = this.writeWorkbook(worksheet);
    this.saveAsExcelFile(workbook, filename);
  }

  private createWorksheet(data: any[]): string {
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += headers.map(header => row[header]).join(',') + '\n';
    });
    return csv;
  }

  private writeWorkbook(worksheet: string): Blob {
    return new Blob([worksheet], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private saveAsExcelFile(workbook: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(workbook);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().getTime()}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
