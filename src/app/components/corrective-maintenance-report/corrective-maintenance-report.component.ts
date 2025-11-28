import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { CorrectiveMaintenanceReport } from '../../models/reports/corrective-maintenance-report.model';

@Component({
  selector: 'app-corrective-maintenance-report',
  templateUrl: './corrective-maintenance-report.component.html',
  styleUrls: ['./corrective-maintenance-report.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CorrectiveMaintenanceReportComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  report: CorrectiveMaintenanceReport | null = null;
  loading: boolean = false;
  error: string = '';
  activeTab: string = 'overdue';

  // Pagination for overdue
  currentPageOverdue = 1;
  itemsPerPageOverdue = 5;
  pageSizeOptionsOverdue = [5, 10, 25, 50, 100];

  // Pagination for upcoming
  currentPageUpcoming = 1;
  itemsPerPageUpcoming = 5;
  pageSizeOptionsUpcoming = [5, 10, 25, 50, 100];

  // Pagination for top vehicles
  currentPageTopVehicles = 1;
  itemsPerPageTopVehicles = 5;
  pageSizeOptionsTopVehicles = [5, 10, 25, 50, 100];

  // Pagination for corrective history
  currentPageHistory = 1;
  itemsPerPageHistory = 5;
  pageSizeOptionsHistory = [5, 10, 25, 50, 100];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Definir data inicial como 30 dias atrás
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
    
    // Gera o relatório automaticamente ao carregar a página
    this.generateReport();
  }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Por favor, selecione as datas.';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.reportService.getCorrectiveMaintenanceReport(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.report = data;
          this.loading = false;
          // Define a primeira aba disponível como ativa
          if (data.overdueCorrective && data.overdueCorrective.length > 0) {
            this.activeTab = 'overdue';
          } else if (data.upcomingCorrective && data.upcomingCorrective.length > 0) {
            this.activeTab = 'upcoming';
          } else if (data.topVehicles && data.topVehicles.length > 0) {
            this.activeTab = 'topVehicles';
          } else {
            this.activeTab = 'history';
          }
        },
        error: (err) => {
          this.error = 'Erro ao gerar relatório: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  exportToExcel(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.reportService.exportCorrectiveMaintenanceToExcel(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-manutencao-corretiva-${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erro ao exportar para Excel:', err);
          this.error = 'Erro ao exportar para Excel';
        }
      });
  }

  exportToPDF(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.reportService.exportCorrectiveMaintenanceToPDF(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-manutencao-corretiva-${new Date().toISOString().split('T')[0]}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erro ao exportar para PDF:', err);
          this.error = 'Erro ao exportar para PDF';
        }
      });
  }

  // Pagination methods for overdue maintenances
  get paginatedOverdue() {
    if (!this.report?.overdueCorrective) return [];
    const start = (this.currentPageOverdue - 1) * this.itemsPerPageOverdue;
    const end = start + this.itemsPerPageOverdue;
    return this.report.overdueCorrective.slice(start, end);
  }

  get totalPagesOverdue(): number {
    if (!this.report?.overdueCorrective) return 0;
    return Math.ceil(this.report.overdueCorrective.length / this.itemsPerPageOverdue);
  }

  get totalItemsOverdue(): number {
    return this.report?.overdueCorrective?.length || 0;
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
    if (!this.report?.upcomingCorrective) return [];
    const start = (this.currentPageUpcoming - 1) * this.itemsPerPageUpcoming;
    const end = start + this.itemsPerPageUpcoming;
    return this.report.upcomingCorrective.slice(start, end);
  }

  get totalPagesUpcoming(): number {
    if (!this.report?.upcomingCorrective) return 0;
    return Math.ceil(this.report.upcomingCorrective.length / this.itemsPerPageUpcoming);
  }

  get totalItemsUpcoming(): number {
    return this.report?.upcomingCorrective?.length || 0;
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

  // Pagination methods for top vehicles
  get paginatedTopVehicles() {
    if (!this.report?.topVehicles) return [];
    const start = (this.currentPageTopVehicles - 1) * this.itemsPerPageTopVehicles;
    const end = start + this.itemsPerPageTopVehicles;
    return this.report.topVehicles.slice(start, end);
  }

  get totalPagesTopVehicles(): number {
    if (!this.report?.topVehicles) return 0;
    return Math.ceil(this.report.topVehicles.length / this.itemsPerPageTopVehicles);
  }

  get totalItemsTopVehicles(): number {
    return this.report?.topVehicles?.length || 0;
  }

  get pagesTopVehicles(): number[] {
    return Array.from({ length: this.totalPagesTopVehicles }, (_, i) => i + 1);
  }

  changePageTopVehicles(page: number): void {
    if (page >= 1 && page <= this.totalPagesTopVehicles) {
      this.currentPageTopVehicles = page;
    }
  }

  onPageSizeChangeTopVehicles(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageTopVehicles = parseInt(target.value, 10);
    this.currentPageTopVehicles = 1;
  }

  // Pagination methods for corrective history
  get paginatedHistory() {
    if (!this.report?.correctiveHistory) return [];
    const start = (this.currentPageHistory - 1) * this.itemsPerPageHistory;
    const end = start + this.itemsPerPageHistory;
    return this.report.correctiveHistory.slice(start, end);
  }

  get totalPagesHistory(): number {
    if (!this.report?.correctiveHistory) return 0;
    return Math.ceil(this.report.correctiveHistory.length / this.itemsPerPageHistory);
  }

  get totalItemsHistory(): number {
    return this.report?.correctiveHistory?.length || 0;
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

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Agendada',
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Progresso',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || status;
  }
}
