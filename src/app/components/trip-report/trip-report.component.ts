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
  startDate: string = '';
  endDate: string = '';
  
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
}
